import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, borderRadius, shadows} from '../styles/theme';
import {useAuth} from '../context/AuthContext';

const SetupScreen = () => {
  const {logout} = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Setup & Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userRole}>Sales Officer</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="log-out-outline" size={24} color={colors.textWhite} style={{marginRight: 8}} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
    marginBottom: spacing.xxl,
  },
  logoutText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});

export default SetupScreen;
