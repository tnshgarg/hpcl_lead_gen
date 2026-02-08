import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, fontWeight, borderRadius, shadows} from '../styles/theme';
import {useLeads} from '../context/LeadsContext';
import AccountDetailModal from '../components/AccountDetailModal';

const ActionHistoryScreen = ({navigation}) => {
  const {actionHistory, fetchActionHistory, isLoading} = useLeads();
  const [selectedFilter, setSelectedFilter] = useState('All Activities');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const filters = ['All Activities', 'Status ˅', 'Date ˅'];

  useEffect(() => {
    fetchActionHistory();
  }, []);

  const handleActivityPress = (activity) => {
    setSelectedAccount(activity);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Action History</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="options-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
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
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Monthly Performance Card */}
        <View style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <Text style={styles.performanceLabel}>MONTHLY PERFORMANCE</Text>
            <Text style={styles.performanceMonth}>October 2023</Text>
          </View>
          <View style={styles.performanceMetrics}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Calls</Text>
              <Text style={styles.metricValue}>45</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Meetings</Text>
              <Text style={styles.metricValue}>12</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Success</Text>
              <Text style={styles.metricValue}>18%</Text>
            </View>
          </View>
        </View>

        {/* Recent Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITIES</Text>
          
          {actionHistory.length === 0 && (
             <Text style={{color: colors.textSecondary, fontStyle: 'italic', marginLeft: 4}}>No recent activity.</Text>
          )}

          {actionHistory.slice(0, 5).map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={styles.activityIconContainer}>
                <Icon name={activity.icon || 'business'} size={24} color={colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityCompany}>{activity.company || 'Unknown Company'}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: activity.statusColor || colors.textLight},
                    ]}>
                    <Text style={styles.statusText}>{activity.status || 'LOGGED'}</Text>
                  </View>
                </View>
                <Text style={styles.activityQuote} numberOfLines={2}>"{activity.quote || activity.notes || 'No notes available'}"</Text>
                <View style={styles.activityFooter}>
                  <View style={styles.dateContainer}>
                    <Icon name="calendar-outline" size={12} color={colors.textLight} style={styles.dateIcon} />
                    <Text style={styles.dateText}>{activity.date}</Text>
                  </View>
                  {activity.nextDate && (
                    <Text style={styles.nextDate}>Next: {activity.nextDate}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{height: spacing.xxxl * 2}} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="add" size={32} color={colors.textWhite} />
      </TouchableOpacity>

      {/* Account Detail Modal */}
      <AccountDetailModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        account={selectedAccount}
      />
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
    backgroundColor: colors.background, // Seamless match
  },
  iconButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  filterIcon: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background, // Match background
  },
  filterPill: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textWhite,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  performanceCard: {
    backgroundColor: '#1E293B', // Dark slate for contrast
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  performanceLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  performanceMonth: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  performanceMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: fontWeight.extraBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: '#F1F5F9', // Light cool grey
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityCompany: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
    letterSpacing: 0.5,
  },
  activityQuote: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: fontWeight.medium,
  },
  nextDate: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  noNextDate: {
    fontSize: 11,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20, // Move to right side standard practice
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});

export default ActionHistoryScreen;
