import { ViewStyle } from 'react-native';

/**
 * Helper de estilos "glow" (resplandor) reutilizable en toda la app.
 * No depende del tema — recibe el color de acento actual (colors.accent)
 * y genera la sombra/resplandor alrededor de tarjetas y botones circulares,
 * inspirado en el estilo de dashboard con íconos redondos luminosos.
 *
 * No modifica ThemeContext ni ningún color existente: solo compone
 * shadow/elevation a partir de los colores que ya tiene la app.
 */

type GlowOptions = {
  opacity?: number;
  radius?: number;
  elevation?: number;
};

/** Resplandor suave para tarjetas grandes (cards, banners, hero). */
export function glowCard(color: string, opts: GlowOptions = {}): ViewStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: opts.elevation ? opts.elevation / 2 : 6 },
    shadowOpacity: opts.opacity ?? 0.28,
    shadowRadius: opts.radius ?? 16,
    elevation: opts.elevation ?? 8,
  };
}

/** Resplandor más intenso y centrado, para botones/íconos circulares. */
export function glowCircle(color: string, opts: GlowOptions = {}): ViewStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: opts.opacity ?? 0.55,
    shadowRadius: opts.radius ?? 12,
    elevation: opts.elevation ?? 10,
  };
}

/** Tamaños estándar para botones circulares tipo "quick action". */
export const CIRCLE_SIZES = {
  sm: 44,
  md: 56,
  lg: 68,
};