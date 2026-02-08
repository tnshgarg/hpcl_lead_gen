import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, borderRadius, shadows, fontWeight} from '../styles/theme';
import {useAuth} from '../context/AuthContext';

const ProfileScreen = () => {
  const {user, logout} = useAuth();

  // Fallback if user data is missing (e.g. during development/hot reload)
  const username = user?.username || 'User';
  const role = user?.role || 'Sales Officer';

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(username)}</Text>
            </View>
            <View style={styles.statusBadge} />
          </View>
          
          <Text style={styles.userName}>{username}</Text>
          <View style={styles.roleContainer}>
            <Icon name="briefcase-outline" size={14} color={colors.textSecondary} style={{marginRight: 4}} />
            <Text style={styles.userRole}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Active Leads</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Conversion</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="person-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>{username}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{role}</Text>
            </View>
          </View>

           <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="notifications-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Notifications</Text>
              <Text style={styles.infoValue}>Enabled</Text>
            </View>
             <Icon name="chevron-forward" size={20} color={colors.textLight} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="log-out-outline" size={24} color={colors.error} style={{marginRight: 8}} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.2 • Build 2026.02</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  profileCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl, // Larger rounding
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.cardBackground,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  userRole: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    textTransform: 'uppercase',
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
  },
  userInfoSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2', // Light red bg
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FAC7C7',
    marginBottom: spacing.lg,
  },
  logoutText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.textLight,
    marginBottom: spacing.xl,
  },
});

export default ProfileScreen;
