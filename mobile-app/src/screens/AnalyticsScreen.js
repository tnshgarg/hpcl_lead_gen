import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../styles/theme';
import api from '../services/api';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState('6m');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const response = await api.getAnalyticsStats(timeRange);
      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
  }, [timeRange]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Analyzing data...</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAnalytics}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Components ---

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
            <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.logoIcon}>
                 <Text style={{color: 'white', fontWeight: 'bold'}}>S</Text>
            </LinearGradient>
            <Text style={styles.appName}>Sales Analytics</Text>
        </View>
        <View style={styles.headerActions}>
           <TouchableOpacity onPress={fetchAnalytics} style={{marginRight: 16}}>
             <Icon name="refresh" size={24} color={colors.textSecondary} />
           </TouchableOpacity>
           <View style={styles.avatar}>
               <Text style={styles.avatarText}>U</Text>
           </View>
        </View>
      </View>
      <View style={styles.headerBottom}>
        <Text style={styles.pageTitle}>Performance Overview</Text>
        <Text style={styles.pageSubtitle}>Real-time Data Analysis</Text>
      </View>
    </View>
  );

  const SummaryCards = () => {
    if (!data) return null;

    const summaryItems = [
      { label: 'Leads', subLabel: 'INCREASE', value: data.leadsIncrease, icon: 'trending-up', color: '#10B981' },
      { label: 'Total', subLabel: 'LEADS', value: data.totalLeads, icon: 'people', color: '#6366F1' },
      { label: 'Avg', subLabel: 'MONTHLY', value: data.avgPerMonth, icon: 'calendar', color: '#F97316' },
      // { label: 'Best', subLabel: 'MONTH', value: data.bestMonth, icon: 'trophy', color: '#F43F5E' },
    ];

    return (
      <View style={styles.summaryContainer}>
        {summaryItems.map((item, index) => (
          <View key={index} style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
               <Icon name={item.icon} size={16} color={item.color} />
               <Text style={[styles.summaryValue, {color: item.color}]}>{item.value}</Text>
            </View>
            <Text style={styles.summaryLabel}>{item.label}</Text>
            <Text style={styles.summarySubLabel}>{item.subLabel}</Text>
          </View>
        ))}
      </View>
    );
  };

  const LeadGenerationChart = () => {
    if (!data || !data.monthlyTrends || data.monthlyTrends.length === 0) return null;

    // Get last 2 months for display if available, otherwise all
    const displayTrends = data.monthlyTrends.slice(-4); 

    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardTitle}>Lead Generation</Text>
            <Text style={styles.cardSubtitle}>RECENT TRENDS</Text>
          </View>
          <TouchableOpacity style={styles.historyButton} onPress={() => {
             const nextRange = timeRange === '6m' ? '1y' : (timeRange === '1y' ? 'all' : '6m');
             setTimeRange(nextRange);
          }}>
              <Text style={styles.historyButtonText}>{timeRange.toUpperCase()}</Text>
              <Icon name="chevron-down" size={12} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.barChartContainer}>
          {displayTrends.map((item, index) => {
            const isLast = index === displayTrends.length - 1;
            // Normalize height slightly for visualization
            const maxVal = Math.max(...displayTrends.map(t => t.value)) || 1;
            const height = Math.max(20, (item.value / maxVal) * 160);
            
            return (
              <View key={index} style={styles.barColumn}>
                  {isLast && (
                    <View style={styles.activeLabelContainer}>
                        <Text style={styles.barValueActive}>{item.value}</Text>
                    </View>
                  )}
                  {!isLast && <Text style={styles.barValue}>{item.value}</Text>}
                  
                  <LinearGradient
                      colors={isLast ? ['#818CF8', '#4F46E5'] : ['#E0E7FF', '#C7D2FE']} 
                      style={[styles.bar, {height, width: isLast ? 60 : 40}]} 
                  />
                  <Text style={[styles.barLabel, isLast && {fontWeight: 'bold', color: 'black'}]}>
                    {item.label.toUpperCase()}
                  </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const ConversionFunnel = () => {
    if (!data || !data.funnelData) return null;

    return (
      <View style={styles.card}>
        <View style={{marginBottom: 20}}>
          <Text style={styles.cardTitle}>Conversion Funnel</Text>
          <Text style={styles.cardSubtitle}>LEAD PROGRESSION STAGES</Text>
        </View>

        <View style={styles.funnelList}>
          {data.funnelData.map((item, index) => {
              // Decrease width for visual funnel
              const widthPercent = `${100 - (index * 8)}%`;
              const colorsList = [
                 ['#4F46E5', '#3730A3'],
                 ['#6366F1', '#4338CA'],
                 ['#A855F7', '#7E22CE'],
                 ['#F97316', '#EA580C'],
                 ['#EF4444', '#DC2626']
              ];
              
              return (
                  <LinearGradient
                      key={index}
                      colors={colorsList[index % colorsList.length]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={[styles.funnelItem, {width: widthPercent, alignSelf: 'center'}]}
                  >
                      <Text style={styles.funnelItemLabel}>{item.label.toUpperCase()}</Text>
                      <View style={styles.funnelItemStats}>
                          <Text style={styles.funnelItemCount}>{item.value}</Text>
                          <Text style={styles.funnelItemPercent}>{item.percent}</Text>
                      </View>
                  </LinearGradient>
              );
          })}
        </View>
      </View>
    );
  };

  const IndustryPerformance = () => {
     if (!data || !data.industryPerformance) return null;

     return (
      <View style={{marginTop: 24}}>
          <View style={styles.sectionHeader}>
              <View>
                  <Text style={styles.sectionTitle}>Industry Performance</Text>
                  <Text style={styles.sectionSubtitle}>SECTOR ANALYSIS</Text>
              </View>
              {/* <Icon name="filter" size={20} color={colors.textSecondary} /> */}
          </View>
          
          <View style={styles.industryGrid}>
              {data.industryPerformance.map((item, index) => (
                  <View key={index} style={styles.industryCard}>
                      <View style={styles.industryHeader}>
                          <View style={styles.industryIconContainer}>
                              <Text style={{fontSize: 16}}>{item.icon}</Text>
                          </View>
                          <Text style={styles.industryName} numberOfLines={1}>{item.name}</Text>
                      </View>
                      <View style={styles.industryStats}>
                          <Text style={styles.industryCount}>{item.value}</Text>
                          <View style={styles.growthBadge}>
                              <Text style={styles.growthText}>{item.growth}</Text>
                          </View>
                      </View>
                  </View>
              ))}
          </View>
      </View>
    );
  };

  const StatusDonut = () => {
    if (!data || !data.statusDistribution) return null;

    return (
      <View style={[styles.card, {marginTop: 24, alignItems: 'center'}]}>
          <Text style={[styles.cardTitle, {alignSelf: 'flex-start', marginBottom: 30}]}>Status Distribution</Text>
          
          <View style={styles.donutContainer}>
              <View style={styles.donutOuter}>
                   <View style={styles.donutInner}>
                       <Text style={styles.donutTotal}>{data.totalLeads}</Text>
                       <Text style={styles.donutLabel}>TOTAL</Text>
                   </View>
              </View>
               <View style={[styles.segment, {borderColor: '#3B82F6', borderTopWidth: 10, borderRightWidth: 10, transform: [{rotate: '45deg'}]}]} />
          </View>

          <View style={styles.legendContainer}>
              {data.statusDistribution.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                      <View style={[styles.legendDot, {backgroundColor: item.color.replace('bg-', '').replace('-500', '') === 'indigo' ? '#6366F1' : (item.color.includes('purple') ? '#A855F7' : (item.color.includes('green') ? '#22C55E' : '#94A3B8')) }]} />
                      <Text style={styles.legendLabel}>{item.label}</Text>
                      <Text style={styles.legendPercent}>{item.percent}%</Text>
                  </View>
              ))}
          </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />
        <SummaryCards />
        <LeadGenerationChart />
        <ConversionFunnel />
        <IndustryPerformance />
        <StatusDonut />
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light grey background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.error,
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  retryButtonText: {
    color: colors.textWhite,
    fontWeight: fontWeight.bold,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  // Header
  header: {
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  logoIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
  },
  appName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#111827',
  },
  headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#F97316',
      alignItems: 'center',
      justifyContent: 'center',
  },
  avatarText: {
      color: 'white',
      fontWeight: 'bold',
  },
  headerBottom: {
      marginTop: 4,
  },
  pageTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 4,
  },
  pageSubtitle: {
      fontSize: 12,
      color: '#6B7280',
  },
  
  // Summary Cards
  summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
  },
  summaryCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      width: '31%',
      ...shadows.sm,
  },
  summaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 4,
  },
  summaryValue: {
      fontSize: 12,
      fontWeight: 'bold',
  },
  summaryLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 2,
  },
  summarySubLabel: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#9CA3AF',
      letterSpacing: 0.5,
  },

  // Generic Card
  card: {
      backgroundColor: 'white',
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      ...shadows.sm,
  },
  cardHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 50,
  },
  cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 4,
  },
  cardSubtitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#9CA3AF',
      letterSpacing: 1,
  },
  historyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EEF2FF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 4,
  },
  historyButtonText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#4F46E5',
  },

  // Lead Gen Chart
  barChartContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      height: 180,
  },
  barColumn: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 12,
  },
  bar: {
      width: 60,
      borderRadius: 12,
  },
  barLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#9CA3AF',
  },
  barValue: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#6B7280',
      marginBottom: 4,
  },
  barValueActive: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#4F46E5',
      marginBottom: 4,
  },

  // Funnel
  funnelList: {
      alignItems: 'center',
      gap: 12,
  },
  funnelItem: {
      height: 44,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      shadowColor: "#4F46E5",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4, 
  },
  funnelItemLabel: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 11,
      letterSpacing: 0.5,
  },
  funnelItemStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  funnelItemCount: {
       color: 'white',
       fontWeight: 'bold',
       fontSize: 13,
  },
  funnelItemPercent: {
       color: 'rgba(255,255,255,0.7)',
       fontSize: 10,
  },

  // Industry
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 16,
      paddingHorizontal: 4,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#111827',
  },
  sectionSubtitle: {
       fontSize: 10,
       fontWeight: 'bold',
       color: '#9CA3AF',
       marginTop: 2,
       letterSpacing: 1,
  },
  industryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
  },
  industryCard: {
      width: '48%',
      backgroundColor: '#111827', // Dark navy
      borderRadius: 20,
      padding: 16,
  },
  industryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      gap: 10,
  },
  industryIconContainer: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  industryName: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
      flex: 1,
  },
  industryStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
  },
  industryCount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
  },
  growthBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // Green tint
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
  },
  growthText: {
      color: '#10B981',
      fontSize: 10,
      fontWeight: 'bold',
  },

  // Donut
  donutContainer: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 12,
      borderColor: '#3B82F6', // Main blue
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginBottom: 30,
  },
  donutInner: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  donutTotal: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#111827',
  },
  donutLabel: {
      fontSize: 10,
      color: '#9CA3AF',
      letterSpacing: 1,
  },
  // Simple legend
  legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 12,
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%',
      marginBottom: 12,
  },
  legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
  },
  legendLabel: {
      fontSize: 12,
      color: '#4B5563',
      flex: 1,
        fontWeight: '500',
  },
  legendPercent: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#111827',
  },
});

export default AnalyticsScreen;
