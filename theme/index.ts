import { colors } from './colors';
import { useColorScheme } from 'react-native';

export const spacing = (factor: number) => factor * 8;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text },
  h2: { fontSize: 22, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, color: colors.text },
  small: { fontSize: 14, color: colors.textSecondary }
};

export function useTheme() {
  const scheme = useColorScheme();
  // Placeholder para dark mode (poderia expandir)
  return { colors, typography, spacing, mode: scheme };
}
