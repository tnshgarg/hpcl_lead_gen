import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, fontWeight, borderRadius, shadows} from '../styles/theme';

const {height} = Dimensions.get('window');

const AccountDetailModal = ({visible, onClose, account}) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!account) return null;

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Growth Opportunity Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="trending-up-outline" size={20} color={colors.success} />
          <Text style={styles.cardTitle}>GROWTH OPPORTUNITY</Text>
        </View>
        <Text style={styles.opportunityText}>
          High potential for upsell in <Text style={styles.bold}>Hydraulic Series</Text>.
          Current usage indicates 20% capacity increase needed by Q4.
        </Text>
      </View>

      {/* Account Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>REVENUE</Text>
          <Text style={styles.statValue}>$12M</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>EMPLOYEES</Text>
          <Text style={styles.statValue}>120</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TIER</Text>
          <Text style={styles.statValue}>Platinum</Text>
        </View>
      </View>

      {/* Recent Projects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT PROJECTS</Text>
        <View style={styles.projectItem}>
          <View style={styles.projectIcon}>
            <Icon name="construct-outline" size={16} color={colors.primary} />
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>Expansion North Wing</Text>
            <Text style={styles.projectStatus}>In Progress • 75%</Text>
          </View>
        </View>
        <View style={styles.projectItem}>
          <View style={styles.projectIcon}>
            <Icon name="cube-outline" size={16} color={colors.textSecondary} />
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>Fleet Renewal 2023</Text>
            <Text style={styles.projectStatus}>Completed • Oct 2023</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActivity = () => (
    <View style={styles.tabContent}>
      {/* Timeline */}
      <View style={styles.timeline}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineTime}>10:00 AM</Text>
              <Text style={styles.timelineDate}>Oct {24 - index}</Text>
            </View>
            <View style={styles.timelineDotContainer}>
              <View style={styles.timelineLine} />
              <View style={[styles.timelineDot, index === 0 && styles.timelineDotActive]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>{index === 0 ? 'Call with Purchasing' : 'Email Sent'}</Text>
              <Text style={styles.timelineDesc}>
                Discussed pricing for bulk order of G-90 series.
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>{account.company}</Text>
            <TouchableOpacity style={styles.crmLink}>
              <Icon name="open-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Account Header Info */}
          <View style={styles.accountHeaderInfo}>
            <View style={styles.logoPlaceholder}>
              <Icon name={account.icon || 'business'} size={32} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.industryText}>{account.industry || 'Manufacturing'}</Text>
              <Text style={styles.locationText}>{account.location || 'Chicago, IL'}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Overview' && styles.tabActive]}
              onPress={() => setActiveTab('Overview')}>
              <Text style={[styles.tabText, activeTab === 'Overview' && styles.tabTextActive]}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Activity' && styles.tabActive]}
              onPress={() => setActiveTab('Activity')}>
              <Text style={[styles.tabText, activeTab === 'Activity' && styles.tabTextActive]}>Activity</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {activeTab === 'Overview' ? renderOverview() : renderActivity()}
             <View style={{height: spacing.xxxl}} />
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
             <TouchableOpacity style={styles.fullProfileButton} onPress={() => alert('Opening Full CRM Profile...')}>
              <Text style={styles.fullProfileText}>View Full CRM Profile</Text>
              <Icon name="arrow-forward" size={16} color={colors.primary} style={{marginLeft: 4}}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    height: height * 0.85,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  crmLink: {
    padding: spacing.xs,
  },
  accountHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.cardBackground,
    marginBottom: spacing.sm,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  industryText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContent: {
    padding: spacing.base,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    letterSpacing: 0.5,
  },
  opportunityText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  projectIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  projectStatus: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  timelineLeft: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: spacing.md,
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  timelineDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 20,
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    bottom: -spacing.xl,
    width: 2,
    backgroundColor: colors.borderLight,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginTop: 4,
    zIndex: 1,
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
    left: -1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.sm,
  },
  timelineTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.cardBackground,
  },
  fullProfileButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  fullProfileText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});

export default AccountDetailModal;
