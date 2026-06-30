import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Última transición antes de mostrar el Login — recrea el fondo
 * "difuminado" tipo Expo/Facebook, pero en tonos morados translúcidos
 * en vez de azul/verde. Como no usamos ninguna librería de blur nueva,
 * el efecto se logra con varios círculos suaves superpuestos en
 * distintos tonos de morado y opacidad baja.
 *
 * El fondo (los blobs) se adapta al tema; el spinner usa colors.accent,
 * que es el mismo morado fijo en modo claro y oscuro.
 */
export default function ReturnToLoginScreen() {
  const { colors } = useTheme();

  const fade = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Movimiento lentísimo de los blobs, para que se sienta "vivo"
    // mientras dura la transición.
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const blobShift = (range: number) => ({
    transform: [
      {
        translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, range] }),
      },
    ],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.bg, opacity: fade }]}>
      {/* Blobs difuminados en tonos morados */}
      <Animated.View
        style={[
          styles.blob,
          { top: -90, left: -70, backgroundColor: colors.accent, opacity: 0.22 },
          blobShift(18),
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          { bottom: -110, right: -80, backgroundColor: colors.accentLight, opacity: 0.16 },
          blobShift(-22),
        ]}
      />
      <Animated.View
        style={[
          styles.blobSmall,
          { top: '38%', right: -50, backgroundColor: colors.accent, opacity: 0.14 },
          blobShift(14),
        ]}
      />
      <Animated.View
        style={[
          styles.blobSmall,
          { bottom: '30%', left: -60, backgroundColor: colors.accentLight, opacity: 0.18 },
          blobShift(-16),
        ]}
      />

      <ActivityIndicator size="small" color={colors.accent} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  blobSmall: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});