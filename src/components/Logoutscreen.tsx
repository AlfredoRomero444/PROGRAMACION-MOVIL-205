import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Pantalla de transición al cerrar sesión: spinner + "Saliendo…",
 * igual que el patrón nativo de apps como Facebook. Usa colors.bg
 * (cambia con el tema) y colors.accent para el spinner, que es el
 * mismo morado en modo claro y oscuro — nunca cambia de color.
 */
export default function LogoutScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>Saliendo…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});