import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable, // Replaced TouchableOpacity
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, fontWeight, borderRadius, shadows} from '../styles/theme';
import {useLeads} from '../context/LeadsContext';

const LeadFeedScreen = ({navigation}) => {
  const {leads, setSelectedLead, fetchLeads, isLoading, error} = useLeads();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filters = ['All', 'High Match', 'New', 'Contacted'];

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  // Filtering & Sorting Logic (Matched with Web UI)
  const filteredAndSortedLeads = useMemo(() => {
    let result = leads.filter(lead => {
      // 1. Search Filter
      const matchesSearch = 
        !searchQuery || 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Category Filter
      switch (selectedFilter) {
        case 'All':
          return true;
        case 'High Match':
          return lead.match >= 80;
        case 'New':
          return lead.status === 'New';
        case 'Contacted':
          return lead.status === 'Contacted';
        default:
          return true;
      }
    });

    // 3. Sorting (Score Descending - Critical for "Feed" feel)
    return result.sort((a, b) => (b.match || 0) - (a.match || 0));
  }, [leads, selectedFilter, searchQuery]);

  const handleLeadPress = (lead) => {
    setSelectedLead(lead);
    navigation.navigate('LeadIntelligence', {leadId: lead.id});
  };

  const handleCallPress = (lead) => {
    setSelectedLead(lead);
    // Directly go to action/outcome screen relative to the lead
    navigation.navigate('DetailedLeadEntry', {leadId: lead.id});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Icon name="stats-chart" size={24} color={colors.primary} />
          </View>
          {isSearchVisible ? (
             <TextInput 
                style={styles.searchInput}
                placeholder="Search leads..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
             />
          ) : (
             <Text style={styles.headerTitle}>Lead Feed</Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <Pressable 
            style={styles.iconButton} 
            onPress={() => {
                setIsSearchVisible(!isSearchVisible);
                if (isSearchVisible) setSearchQuery(''); // Clear on close
            }}
          >
            <Icon name={isSearchVisible ? "close-outline" : "search-outline"} size={24} color={colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Icon name="menu-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* Daily Goal Section REMOVED */}

      {/* Filter Pills */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}>
          {filters.map(filter => (
            <Pressable
              key={filter}
              style={[
                styles.filterPill,
                selectedFilter === filter && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(filter)}>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Lead Cards */}
      <ScrollView style={styles.leadsList} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={{ padding: spacing.xl, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading leads...</Text>
          </View>
        )}
        
        {error && !isLoading && (
          <View style={{ padding: spacing.xl, alignItems: 'center' }}>
            <Icon name="alert-circle" size={48} color={colors.error} />
            <Text style={{ marginTop: spacing.md, color: colors.error }}>Failed to load leads</Text>
            <Pressable 
              style={{ marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.primary, borderRadius: borderRadius.md }}
              onPress={fetchLeads}
            >
              <Text style={{ color: colors.textWhite }}>Retry</Text>
            </Pressable>
          </View>
        )}
        
        {!isLoading && !error && filteredAndSortedLeads.length === 0 && (
          <View style={{ padding: spacing.xl, alignItems: 'center' }}>
            <Icon name="business-outline" size={48} color={colors.textLight} />
            <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>
               {searchQuery ? 'No leads found matching search' : 'No leads available'}
            </Text>
          </View>
        )}
        
        {!isLoading && filteredAndSortedLeads.map(lead => (
          <Pressable
            key={lead.id}
            style={({pressed}) => [styles.leadCard, pressed && {transform: [{scale: 0.99}]}]} // Subtle feedback without opacity
            onPress={() => handleLeadPress(lead)}>
            <View style={styles.leadHeader}>
              <View style={styles.leadHeaderLeft}>
                <View
                  style={[
                    styles.priorityBadge,
                    {backgroundColor: lead.statusColor},
                  ]}>
                  <Text style={styles.priorityText}>{lead.status}</Text>
                </View>
                <Text style={styles.matchText}>{lead.match}% Match</Text>
              </View>
              <Text style={styles.lastContactText}>Last: {lead.lastContact}</Text>
            </View>

            <Text style={styles.companyName}>{lead.name}</Text>
            <Text style={styles.companyInfo}>
              {lead.industry} • {lead.location}
            </Text>

            <View style={styles.bottomRow}>
              <View style={styles.signalsWrapper}>
                <View style={[styles.signalChip, {backgroundColor: lead.signalColor || colors.background}]}>
                  <Icon name={'flash-outline'} size={14} color={colors.textSecondary} style={styles.chipIcon} />
                  <Text style={styles.signalText}>{lead.signal}</Text>
                </View>
                {/* Insight chip simulated for variety */}
                 <View style={styles.insightChip}>
                  <Icon name={'bulb-outline'} size={14} color={colors.primary} style={styles.chipIcon} />
                  <Text style={styles.insightText}>New Insight</Text>
                </View>
              </View>

              <Pressable style={styles.callButton} onPress={() => handleCallPress(lead)}>
                <Icon name="call" size={20} color="#FFF" />
              </Pressable>
            </View>
          </Pressable>
        ))}
        
        {/* Adds padding at bottom */}
        <View style={{height: 100}} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.background, // Match background
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow taking up space for search
  },
  searchInput: {
      flex: 1,
      fontSize: fontSize.lg,
      color: colors.textPrimary,
      paddingVertical: 0,
      marginRight: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.sm,
  },
  // progressContainer Removed
  filterWrapper: {
    height: 60, // Fixed height for filter section
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBackground,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.soft,
  },
  filterText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textWhite,
    fontWeight: fontWeight.bold,
  },
  content: {
    padding: spacing.base,
  },
  leadsList: {
    flex: 1,
    paddingHorizontal: spacing.lg, // Increased from base to lg to reduce card width
    paddingTop: spacing.sm,
  },
  leadCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  leadHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: fontWeight.extraBold,
    color: colors.textWhite,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  matchText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  lastContactText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  companyName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  companyInfo: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  // Compact Bottom Row Container
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  signalsWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  signalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6, // Slightly reduced vertical padding for compactness
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipIcon: {
    marginRight: spacing.xs,
  },
  signalText: {
    fontSize: fontSize.xs, // Reduced font size for tags
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  insightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  insightText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  callButton: {
    width: 44, // Reduced size for inline fit
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
});

export default LeadFeedScreen;
