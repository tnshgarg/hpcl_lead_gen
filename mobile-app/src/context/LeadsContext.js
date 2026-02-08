import React, {createContext, useState, useContext} from 'react';
import api from '../services/api';

const LeadsContext = createContext();

export const LeadsProvider = ({children}) => {
  const [leads, setLeads] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch leads from API
  const fetchLeads = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getLeads(filters);
      if (response.success) {
        setLeads(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError(err.message);
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch action history from API
  const fetchActionHistory = async () => {
    try {
      const response = await api.getActionHistory();
      if (response.success) {
        setActionHistory(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch action history:', err);
      setActionHistory([]);
    }
  };

  const addOutcome = async (leadId, outcomeData, notes) => {
    const lead = leads.find(l => l.id === leadId) || {name: 'Unknown Lead'};
    
    // Create local optimistic update
    const status = outcomeData.status || outcomeData.id || 'UNKNOWN';
    const newAction = {
      id: Date.now(),
      company: lead.name,
      icon: outcomeData.icon && outcomeData.icon.includes('call') ? 'call' : 'mail', // Simple mapping
      quote: notes || 'No notes added.',
      date: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}),
      nextDate: status === 'Interested' ? 'TBD' : null,
      status: status.toUpperCase(),
      statusColor: outcomeData.color,
    };

    // Optimistically update UI
    setActionHistory(prev => [newAction, ...prev]);

    // Send to Backend
    try {
      const activityPayload = {
        type: 'Note', // Default type for outcomes
        title: `${outcomeData.label} - ${lead.name}`,
        description: notes || `Outcome: ${outcomeData.label}`,
        date: new Date(),
        metadata: {
          leadId: leadId,
          status: status,
          nextStep: 'TBD'
        }
      };
      
      // If we had accountId, we would add it here
      // activityPayload.account = lead.accountId;

      await api.createActivity(activityPayload);
      console.log('Outcome saved to backend');
    } catch (err) {
      console.error('Failed to save outcome to backend:', err);
      // Optionally revert optimistic update here
    }
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        actionHistory,
        selectedLead,
        isLoading,
        error,
        setSelectedLead,
        addOutcome,
        fetchLeads,
        fetchActionHistory,
      }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => useContext(LeadsContext);
