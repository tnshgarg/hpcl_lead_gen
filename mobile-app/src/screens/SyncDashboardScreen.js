import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, fontWeight, borderRadius, shadows} from '../styles/theme';

const SyncDashboardScreen = ({navigation}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleForceSync = () => {
    setIsSyncing(true);
    // Simulate sync delay
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert('Sync Complete', 'All data has been successfully synchronized with the server.');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sync Dashboard</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Central Sync Illustration */}
        <View style={styles.syncIllustration}>
          <View style={styles.syncIconContainer}>
            <Icon name="cloud-upload-outline" size={64} color={colors.primary} />
            <View style={styles.refreshIconContainer}>
               <Icon name="refresh-circle" size={32} color={colors.success} />
            </View>
          </View>
        </View>

        {/* Offline Badge */}
        <View style={styles.offlineBadge}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineText}>WORKING OFFLINE</Text>
        </View>

        {/* Active Sync Engine */}
        <View style={styles.syncStatus}>
          <Text style={styles.syncTitle}>Active Sync Engine</Text>
          <Text style={styles.syncSubtitle}>Changes are queued for next connection</Text>
        </View>

        {/* Network Quality Section */}
        <View style={styles.section}>
          <View style={styles.networkCard}>
            <View style={styles.networkHeader}>
              <Text style={styles.sectionLabel}>NETWORK QUALITY</Text>
              <Text style={styles.networkQuality}>Moderate</Text>
            </View>

            {/* Signal Bars */}
            <View style={styles.signalBars}>
              <View style={[styles.signalBar, styles.signalBarActive]} />
              <View style={[styles.signalBar, styles.signalBarActive]} />
              <View style={styles.signalBar} />
              <View style={styles.signalBar} />
              <View style={styles.signalBar} />
            </View>

            {/* Network Info */}
            <View style={styles.networkInfo}>
              <Icon name="cellular-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.networkText}>LTE Industrial Zone A</Text>
            </View>
          </View>
        </View>

        {/* Local Storage Section */}
        <View style={styles.section}>
          <View style={styles.storageCard}>
            <View style={styles.storageHeader}>
              <Text style={styles.sectionLabel}>LOCAL STORAGE STATUS</Text>
              <View style={styles.storageIcon}>
                <Icon name="save-outline" size={20} color={colors.primary} />
              </View>
            </View>

            <View style={styles.storageInfo}>
              <Text style={styles.storageAmount}>124MB</Text>
              <Text style={styles.storageLabel}> of data cached</Text>
            </View>

            {/* Storage Progress Bar */}
            <View style={styles.storageBar}>
              <View style={[styles.storageBarFill, {width: '45%'}]} />
            </View>
          </View>
        </View>

        {/* Force Sync Button */}
        <TouchableOpacity 
          style={styles.forceSyncButton} 
          onPress={handleForceSync}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <>
              <Icon name="sync" size={20} color={colors.textWhite} style={{ marginRight: 8 }} />
              <Text style={styles.forceSyncText}>Force Manual Sync</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Back to Dashboard Button */}
        <TouchableOpacity
          style={styles.backToDashboardButton}
          onPress={() => navigation.navigate('LeadFeed')}>
          <Text style={styles.backToDashboardText}>Back to Dashboard</Text>
        </TouchableOpacity>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    alignItems: 'center',
  },
  syncIllustration: {
    width: 200,
    height: 200,
    borderRadius: 40,
    backgroundColor: '#E8F2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 3,
    borderColor: '#D6E4FF',
    borderStyle: 'dashed',
  },
  syncIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIconContainer: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.full,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: '#D97706', // Darker warning color
    marginRight: spacing.sm,
  },
  offlineText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: '#92400E',
    letterSpacing: 0.5,
  },
  syncStatus: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  syncTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  syncSubtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: fontWeight.extraBold,
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  networkCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  networkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  networkQuality: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#F59E0B', // Amber 500
  },
  signalBars: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.md,
    alignItems: 'flex-end',
    height: 32,
  },
  signalBar: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  signalBarActive: {
    backgroundColor: colors.primary,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  storageCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  storageIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  storageAmount: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  storageLabel: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  storageBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  forceSyncButton: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  forceSyncText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  backToDashboardButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backToDashboardText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});

export default SyncDashboardScreen;
