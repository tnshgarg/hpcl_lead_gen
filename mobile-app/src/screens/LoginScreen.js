import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, fontWeight, borderRadius, shadows} from '../styles/theme';
import {useAuth} from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const {login, register} = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    
    if (isLogin) {
      if (!userId || !password) {
        setError('Please enter both User ID and Password');
        return;
      }

      setLoading(true);
      const success = await login(userId, password);
      setLoading(false);

      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } else {
      // Registration Logic
      if (!userId || !password || !email) {
        setError('Please fill in all required fields (User ID, Password, Email)');
        return;
      }

      setLoading(true);
      const success = await register(userId, password, email, phone, 'sales');
      setLoading(false);

      if (!success) {
        setError('Registration failed. Username or Email may already exist.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Icon name="business" size={40} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>Field Sales Pro</Text>
        </View>

        {/* Login/Sign Up Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
            onPress={() => setIsLogin(true)}>
            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
            onPress={() => setIsLogin(false)}>
            <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSubtitle}>
          Please enter your credentials to access the portal.
        </Text>

        {/* User ID Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>User ID</Text>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="Enter User ID"
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Password"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={16} color={colors.error} style={styles.errorIcon} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        {!isLogin && (
          <>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Icon name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email Address"
                  placeholderTextColor={colors.textLight}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone (Optional)</Text>
              <View style={styles.inputContainer}>
                <Icon name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter Phone Number"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </>
        )}

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <>
              <Text style={styles.loginButtonText}>
                {isLogin ? 'Login to Portal' : 'Create Account'}
              </Text>
              <Icon name="arrow-forward" size={20} color={colors.textWhite} style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        {/* Create Account Link */}
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>New here? </Text>
          <TouchableOpacity>
            <Text style={styles.createAccountLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl, // Squircle shape
    backgroundColor: '#EFF6FF', // Soft warm blue
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.soft, // Soft floating shadow
  },
  appTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.xxxl,
    ...shadows.sm, // Inner depth feel
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary, // Using primary for active state instead of white
    ...shadows.md,
  },
  toggleText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.textWhite, // White text on primary background
    fontWeight: fontWeight.bold,
  },
  welcomeTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -1,
  },
  welcomeSubtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: 4, // Add some vertical padding
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  inputIcon: {
    marginRight: spacing.sm,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: '#FEF2F2',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  errorIcon: {
    marginRight: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    fontWeight: fontWeight.medium,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.soft, // Deep soft shadow
  },
  loginButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  createAccountLink: {
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});

export default LoginScreen;
