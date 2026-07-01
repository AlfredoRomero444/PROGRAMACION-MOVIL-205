import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Disco } from '../types';
import { formatPrecio, calcularDescuento, resolveImagen } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

type DiscoCardProps = {
  disco: Disco;
  artistaNombre?: string;
  onPress?: () => void;
};

export default function DiscoCard({ disco, artistaNombre, onPress }: DiscoCardProps) {
  const { colors } = useTheme();
  const descuento = calcularDescuento(disco.precioInicial, disco.precioActual);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.bgCard, borderColor: colors.accentBorder, shadowColor: colors.accent },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.inner}>
        <View style={styles.imageWrapper}>
          <Image source={resolveImagen(disco.imagen)} style={styles.image} resizeMode="cover" />
          {descuento > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={styles.badgeText}>-{descuento}%</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.nombre, { color: colors.textPrimary }]} numberOfLines={1}>
            {disco.nombre}
          </Text>

          {artistaNombre && (
            <Text style={[styles.artista, { color: colors.textSecondary }]} numberOfLines={1}>
              {artistaNombre}
            </Text>
          )}

          <View style={styles.precioRow}>
            <Text style={[styles.precioActual, { color: colors.green }]}>
              {formatPrecio(disco.precioActual)}
            </Text>
            {descuento > 0 && (
              <Text style={[styles.precioInicial, { color: colors.textMuted }]}>
                {formatPrecio(disco.precioInicial)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },
  inner:        { borderRadius: 30, overflow: 'hidden' },
  imageWrapper: { position: 'relative', width: '100%', aspectRatio: 1, overflow: 'hidden' },
  image:        { width: '100%', height: '100%' },

  badge:        {
    position: 'absolute', top: 10, left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 14,
  },
  badgeText:    { color: '#fff', fontSize: 11, fontWeight: '800' },

  info:         { padding: 14 },
  nombre:       { fontSize: 14, fontWeight: '700' },
  artista:      { fontSize: 12, marginTop: 3 },

  precioRow:    { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  precioActual: { fontSize: 14, fontWeight: '700' },
  precioInicial:{ fontSize: 12, textDecorationLine: 'line-through' },
});