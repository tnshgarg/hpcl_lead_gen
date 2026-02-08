import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/env';

const { API_BASE_URL, WIL_API_URL } = config;

// Helper to get token from storage
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper to clear token on 401
const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// Generic request handler
const request = async (endpoint, options = {}, baseUrl = API_BASE_URL) => {
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach token if available (mainly for Backend, WIL might not need it yet but good practice)
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchConfig = {
    ...options,
    headers,
  };

  try {
    const url = `${baseUrl}${endpoint}`;
    console.log(`[API] Requesting: ${url}`);
    const response = await fetch(url, fetchConfig);
    const data = await response.json();

    // Handle 401 Unauthorized (Only for main backend usually)
    if (response.status === 401 && baseUrl === API_BASE_URL) {
      await clearToken();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    // Normalizing response structure if needed
    // Backend returns { success: true, data: ... }
    // WIL might return direct data or { leads: [...] }
    return data;
  } catch (error) {
    console.error(`[API] Error request ${endpoint}:`, error);
    // Return a standardized error object so UI can handle it gracefully
    return { success: false, error: error.message }; 
  }
};

// API Methods
const api = {
  // --- AUTHENTICATION (Backend Port 5001) ---
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }, API_BASE_URL),

  register: (username, password, email, phone, role) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, phone, role }),
    }, API_BASE_URL),

  getMe: () => request('/auth/me', {}, API_BASE_URL),

  // --- LEADS & INTELLIGENCE (WIL Port 3000) ---
  getLeads: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      // Use /dossiers as the primary source, same as Web App
      const endpoint = filters.useLeadsEndpoint ? '/leads' : '/api/v1/dossiers'; 
      const url = `${WIL_API_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      console.log(`[API] Fetching Leads/Dossiers from: ${url}`);
      const response = await fetch(url);
      const data = await response.json();

      let items = [];
      if (data.dossiers) items = data.dossiers;
      else if (data.leads) items = data.leads;
      else if (Array.isArray(data)) items = data;

      // Transform logic ported from Knapsack-Website/src/app/dashboard/leads/page.js
      const formattedLeads = items.map(dossier => {
        // 1. Extract Score
        const scoringSection = dossier.sections?.find(s => s.title === 'Scoring Breakdown');
        const overviewSection = dossier.sections?.find(s => s.title === 'Overview');
        const score = scoringSection?.content?.finalScore 
          ? Math.round(scoringSection.content.finalScore * 100) 
          : 75;

        // 2. Extract Company Name (Robust Fallback Strategy)
        let companyName = 'Unknown Company';
        
        // Priority 1: Explicit field
        if (dossier.company && typeof dossier.company === 'string') {
           companyName = dossier.company;
        } 
        // Priority 2: Overview subject/companyName
        else if (overviewSection?.content?.subject) {
           companyName = overviewSection.content.subject;
        }
        else if (overviewSection?.content?.companyName) {
           companyName = overviewSection.content.companyName;
        }
        // Priority 4: Regex from Human Summary
        else if (dossier.humanSummary) {
           const summaryPatterns = [
            /(?:about|for|from|regarding)\s+([A-Z][A-Za-z0-9\s&.,'-]+?)(?:\s+(?:scored|has|is|was|which|that|\.|,|$))/i,
            /^([A-Z][A-Za-z0-9\s&.,'-]+?)\s+(?:scored|has|is|was)/i,
            /company\s+([A-Z][A-Za-z0-9\s&.,'-]+?)(?:\s|\.|,|$)/i
          ];
          for (const pattern of summaryPatterns) {
            const match = dossier.humanSummary.match(pattern);
            if (match && match[1] && match[1].length > 2 && match[1].length < 50) {
              companyName = match[1].trim();
              break;
            }
          }
        }
        // Priority 5: Source URL domain
        if (companyName === 'Unknown Company' && overviewSection?.content?.sourceUrl) {
           try {
             const urlObj = new URL(overviewSection.content.sourceUrl);
             const domain = urlObj.hostname.replace('www.', '').split('.')[0];
             if (domain) companyName = domain.charAt(0).toUpperCase() + domain.slice(1);
           } catch (e) {}
        }
        // Priority 6: Document ID cleanup
        if (companyName === 'Unknown Company' && dossier.documentId) {
           const docId = dossier.documentId.split('/').pop() || '';
           if (!docId.match(/^[a-f0-9-]{36}$/i)) {
             companyName = docId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
           } else {
             companyName = `Lead ${items.indexOf(dossier) + 1}`;
           }
        }

        // 3. Extract Meta Info
        const primaryIntent = overviewSection?.content?.primaryIntent;
        const industry = typeof primaryIntent === 'string' ? primaryIntent : 'Business Intelligence';
        const location = 'International'; // Default or extract if available
        const status = dossier.consumedAt ? 'Contacted' : (dossier.status === 'approved' ? 'New' : 'New');

        // 4. Map to App UI properties
        let statusColor = '#3B82F6'; // Default Blue
        if (status === 'New') statusColor = '#3B82F6';
        if (status === 'Contacted') statusColor = '#8B5CF6'; // Purple
        if (status === 'Qualified') statusColor = '#10B981'; // Green
        if (status === 'Priority') statusColor = '#EF4444'; // Red

        // 5. Extract Rich Intelligence (Derived from Dossier)
        // Recommendations often reside in sections or top-level array
        const recommendations = dossier.recommendations || [];
        const risks = dossier.risks || [];
        const opportunities = dossier.opportunities || [];
        
        // AI Report Summary: Prioritize Human Summary if available
        let aiReportSummary = [];
        
        // Strategy 1: Use human summary if it exists (split by sentences)
        if (dossier.humanSummary) {
          aiReportSummary = dossier.humanSummary.match(/[^.!?]+[.!?]+/g) || [dossier.humanSummary];
          // Limit to 3 bullets
          aiReportSummary = aiReportSummary.slice(0, 3).map(s => s.trim());
        } 
        
        // Strategy 2: Fallback to structured opportunities/recommendations
        if (aiReportSummary.length === 0) {
           aiReportSummary = [
            ...opportunities.slice(0, 2),
            ...recommendations.slice(0, 1)
          ].map(item => {
             if (typeof item === 'string') return item;
             return item.description || item.type || 'Signal detected';
          });
        }
        
        // Strategy 3: Absolute fallback (Empty state, do NOT use fake data)
        if (aiReportSummary.length === 0) {
            aiReportSummary.push('No specific insights available yet.');
        }

        // Recommended Product Extraction
        let recommendedProduct = {
            name: 'General Inquiry',
            justification: 'Standard engagement protocol.'
        };
        
        // parsing rules for product
        const productMatches = recommendations.filter(r => 
          typeof r === 'string' && r.toUpperCase().startsWith('PRODUCT:')
        );
        
        if (productMatches.length > 0) {
           const match = productMatches[0].replace('PRODUCT:', '').trim();
           // Split name from details if hyphenated
           const parts = match.split('-');
           recommendedProduct.name = parts[0].trim();
           recommendedProduct.justification = parts.length > 1 ? parts[1].trim() : 'Matched based on industry signals.';
        } else {
           // Fallback textual analysis
           const strategySection = dossier.sections?.find(s => s.title?.toLowerCase().includes('strategy') || s.title?.toLowerCase().includes('recommendation'));
             if (strategySection?.content?.text) {
               const text = strategySection.content.text;
               if (text.includes('Premium') || text.includes('Enterprise')) recommendedProduct.name = 'Enterprise Tier';
               else if (text.includes('API')) recommendedProduct.name = 'API Integration';
               recommendedProduct.justification = text.substring(0, 80) + '...';
           }
        }


        return {
          id: dossier.id,
          name: companyName.trim(),
          industry: industry,
          location: location,
          match: score, 
          status: status,
          statusColor: statusColor,
          lastContact: new Date(dossier.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          signal: opportunities[0] || 'High Intent',
          signalColor: '#E0F2FE',
          
          // Enhanced fields for LeadIntelligenceScreen
          confidenceScore: score, // Map score to confidenceScore
          urgencyLevel: score > 85 ? 'High' : (score > 60 ? 'Medium' : 'Low'),
          recommendedProduct: recommendedProduct,
          aiReportSummary: aiReportSummary,
          
          // Contact Details (Mock/Default as scraped data often lacks PII)
          contact: 'Head of Procurement',
          email: 'procurement@' + (overviewSection?.content?.sourceUrl ? new URL(overviewSection.content.sourceUrl).hostname.replace('www.', '') : 'company.com'),
          phone: '+1 (555) 012-3456',

          // Keep raw dossier for deep details
          dossier: dossier
        };
      });

      return { success: true, data: formattedLeads };

    } catch (error) {
      console.error(`[API] Error request /leads:`, error);
      return { success: false, error: error.message };
    }
  },

  getLead: async (id) => {
     // For details, we might need to fetch the specific dossier if not already passed
     return request(`/dossiers/${id}`, {}, WIL_API_URL);
  },

  // --- ACTIVITIES (Backend Port 5001) ---
  getActionHistory: () => request('/activities/history', {}, API_BASE_URL),

  createActivity: (activityData) =>
    request('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    }, API_BASE_URL),

  // --- ANALYTICS (Backend Port 5001) ---
  getAnalyticsStats: (range = '6m') => request(`/analytics/stats?range=${range}`, {}, API_BASE_URL),

  // --- NOTIFICATIONS (Backend Port 5001) ---
  registerFCMToken: (fcmToken) =>
    request('/notifications/register-token', {
      method: 'POST',
      body: JSON.stringify({ fcmToken }),
    }, API_BASE_URL),
};

export default api;
