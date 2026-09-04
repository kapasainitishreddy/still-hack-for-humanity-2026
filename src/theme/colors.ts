// Still — restrained two-tone system.
const MOONLIGHT = '#A6BEDC';
const MOONLIGHT_DEEP = '#8AA4C6';
const ALERT = '#E06A62';

export const Colors = {
  background: '#0A0C10',
  surface: '#12151C',
  raisedSurface: '#181C24',
  surfaceBorder: 'rgba(255, 255, 255, 0.06)',
  borderLight: 'rgba(255, 255, 255, 0.04)',
  card: '#14171F',
  cardHover: '#1E232D',
  emerald: MOONLIGHT,
  emeraldGlow: 'rgba(166, 190, 220, 0.14)',
  emeraldBorder: 'rgba(166, 190, 220, 0.30)',
  icyBlue: MOONLIGHT,
  icyBlueGlow: 'rgba(166, 190, 220, 0.14)',
  icyBlueBorder: 'rgba(166, 190, 220, 0.30)',
  violet: MOONLIGHT_DEEP,
  violetGlow: 'rgba(138, 164, 198, 0.14)',
  violetBorder: 'rgba(138, 164, 198, 0.30)',
  amber: MOONLIGHT,
  amberGlow: 'rgba(166, 190, 220, 0.14)',
  amberBorder: 'rgba(166, 190, 220, 0.30)',
  cyan: MOONLIGHT,
  cyanGlow: 'rgba(166, 190, 220, 0.14)',
  sosRed: ALERT,
  sosRedGlow: 'rgba(224, 106, 98, 0.24)',
  sosRedBorder: 'rgba(224, 106, 98, 0.38)',
  rose: '#D98A86',
  textPrimary: '#EEF1F6',
  textSecondary: '#93A0B2',
  textMuted: '#626E7E',
  divider: 'rgba(255, 255, 255, 0.07)',
  tabBar: '#0A0C10',
  tabActive: MOONLIGHT,
  tabInactive: '#626E7E',
};

export const Shadows = {
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  emeraldGlow: { shadowColor: MOONLIGHT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 24, elevation: 8 },
  violetGlow: { shadowColor: MOONLIGHT_DEEP, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 24, elevation: 8 },
  icyBlueGlow: { shadowColor: MOONLIGHT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 22, elevation: 8 },
  sosGlow: { shadowColor: ALERT, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.26, shadowRadius: 24, elevation: 10 },
};
