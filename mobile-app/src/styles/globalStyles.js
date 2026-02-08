import {StyleSheet} from 'react-native';
import {colors, spacing, fontSize, fontWeight, borderRadius} from './theme';

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  
  // Cards
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  
  // Text Styles
  heading1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  heading2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  heading3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  bodyLarge: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
  },
  bodyMedium: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    color: colors.textLight,
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: colors.cardBackground,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  
  // Inputs
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Row/Column Layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
});
