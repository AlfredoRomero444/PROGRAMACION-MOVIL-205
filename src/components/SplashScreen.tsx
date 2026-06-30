import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Duración mínima que se ve el splash en pantalla (ms), aunque el tema
// ya esté listo antes — igual que hace Facebook con su logo de carga.
const MIN_DURATION = 1400;
const EXIT_DURATION = 380;

type SplashScreenProps = {
  children: React.ReactNode;
};

/**
 * Pantalla de carga inicial: muestra el logo de Asyd Core centrado
 * mientras el tema (claro/oscuro) termina de cargarse desde AsyncStorage.
 * El fondo se adapta al tema (blanco en modo claro, oscuro en modo oscuro),
 * pero el logo SIEMPRE se ve en su morado original — nunca cambia de color.
 */
export default function SplashScreen({ children }: SplashScreenProps) {
  const { colors, isThemeReady } = useTheme();

  const [minTimeDone, setMinTimeDone] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryScale   = useRef(new Animated.Value(0.82)).current;
  const pulse        = useRef(new Animated.Value(1)).current;
  const exitOpacity  = useRef(new Animated.Value(1)).current;

  // Animación de entrada del logo (fade + escala, como el ícono de Facebook)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(entryOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(entryScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Pequeño "respiro" continuo, igual de sutil que los puntitos
      // de carga (✧⋆) que ya usa la app en HomeScreen.
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.06,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    const timer = setTimeout(() => setMinTimeDone(true), MIN_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const yaListo = isThemeReady && minTimeDone;

  // Cuando todo está listo, se desvanece el splash y se revela la app
  useEffect(() => {
    if (yaListo && splashVisible) {
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: EXIT_DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setSplashVisible(false));
    }
  }, [yaListo]);

  return (
    <View style={styles.root}>
      {/* La app vive montada debajo desde el inicio, lista para mostrarse
          en cuanto el splash se desvanezca — sin pantallazo en blanco. */}
      <View style={StyleSheet.absoluteFill}>{children}</View>

      {splashVisible && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.splash,
            { backgroundColor: colors.bg, opacity: exitOpacity },
          ]}
        >
          <Animated.Image
            source={require('../../assets/wolf-logo.png')}
            resizeMode="contain"
            style={[
              styles.logo,
              {
                opacity: entryOpacity,
                transform: [
                  { scale: Animated.multiply(entryScale, pulse) },
                ],
              },
            ]}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  splash: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  logo: {
    width: 240,
    height: 289, // misma proporción que el logo original (462x557)
  },
});