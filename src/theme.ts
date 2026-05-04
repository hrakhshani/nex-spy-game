import { Platform, ViewStyle } from 'react-native';

// Bright open-world fantasy RPG palette: sky, parchment, porcelain panels,
// antique gold trim, and strong elemental role colors.
export const colors = {
  bgDeep: '#6FAED8',
  bgBase: '#B9DEF2',
  bgElevated: '#F4E8CF',
  bgCard: '#FFF8E8',
  bgCardElevated: '#FFFFFF',
  bgInset: '#EFE0C4',

  border: 'rgba(174,128,56,0.22)',
  borderStrong: 'rgba(174,128,56,0.46)',
  divider: 'rgba(174,128,56,0.20)',

  textPrimary: '#3A2A1F',
  textSecondary: '#6E5A43',
  textMuted: '#927C5E',
  textOnAccent: '#38220F',

  // Heroic sky blue
  primary: '#5EA7D8',
  primaryDark: '#2F75A8',
  primaryLight: '#DDF4FF',
  primaryGlow: 'rgba(94,167,216,0.32)',

  // Relic gold
  accent: '#C99642',
  accentSoft: 'rgba(201,150,66,0.16)',
  accentSoftBorder: 'rgba(201,150,66,0.42)',

  warning: '#D88C2A',
  danger: '#C44B54',
  dangerDark: '#7C2430',
  dangerSoft: 'rgba(196,75,84,0.13)',
  dangerSoftBorder: 'rgba(196,75,84,0.44)',
  dangerText: '#7C2430',

  // Roles
  spy: '#B756C8',
  spyDeep: '#F4E4F8',
  spySoft: 'rgba(183,86,200,0.18)',
  citizen: '#4FAD72',
  citizenDeep: '#E1F4E7',
  citizenSoft: 'rgba(79,173,114,0.18)',

  // Disabled surface
  surfaceDisabled: '#D8CAB0',

  // 3D button depth plates (the "shadow side" of arcade-style buttons)
  primaryDepth: '#2D6C99',
  accentDepth: '#8D6426',
  dangerDepth: '#8D2E3A',
  ghostDepth: '#D3C2A5',

  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const typography = {
  display: {
    fontSize: 38,
    fontWeight: '800' as const,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: '800' as const,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
};

const ios = Platform.OS === 'ios';

export const shadows: Record<string, ViewStyle> = {
  card: ios
    ? {
        shadowColor: '#6F4E22',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      }
    : { elevation: 6 },
  button: ios
    ? {
        shadowColor: '#C99642',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      }
    : { elevation: 8 },
  buttonAccent: ios
    ? {
        shadowColor: '#E8C547',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
      }
    : { elevation: 8 },
  buttonDanger: ios
    ? {
        shadowColor: '#C44B54',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
      }
    : { elevation: 8 },
  cardSpy: ios
    ? {
        shadowColor: '#B756C8',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.28,
        shadowRadius: 28,
      }
    : { elevation: 10 },
  cardCitizen: ios
    ? {
        shadowColor: '#4FAD72',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.24,
        shadowRadius: 28,
      }
    : { elevation: 10 },
};
