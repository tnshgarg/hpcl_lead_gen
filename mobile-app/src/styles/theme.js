export const colors = {
  // Primary Colors - Warmer Blue & Deep Royal
  primary: '#2563EB', // A slightly warmer, vibrant blue
  primaryDark: '#1E40AF',
  accent: '#F59E0B', // Warm amber for accents

  // Background Colors - Warm Greys
  background: '#F8FAFC', // Cool/Warm crisp white-grey
  cardBackground: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#1E293B', // Slate 800 - softer than pure black
  textSecondary: '#64748B', // Slate 500
  textLight: '#94A3B8',
  textWhite: '#FFFFFF',
  
  // Priority Colors - Vibrant but not harsh
  hotLead: '#EF4444', 
  warm: '#F97316', // Orange-500
  nurture: '#64748B',
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // UI Elements
  border: '#E2E8F0',
  borderLight: '#F1F5F9', // Very light border
  
  // Specifics
  inputBackground: '#F8FAFC',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16, // More rounded cards
  xl: 24,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15, // Slightly larger base text
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extraBold: '800',
};

export const shadows = {
  sm: {
    shadowColor: '#64748B',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: { // Soft card shadow
    shadowColor: '#64748B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: { // Floating element
    shadowColor: '#475569',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  card: { // "Shadow Box" effect
    shadowColor: '#1E293B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  soft: {
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  }
};
