import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Plus, Check } from 'lucide-react-native';
import { Disco } from '../types';
import { formatPrecio, calcularDescuento, resolveImagen } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

type DiscoCardProps = {
  disco: Disco;
  artistaNombre?: string;
  onPress?: () => void;
};

export default function DiscoCard({ disco, artistaNombre, onPress }: DiscoCardProps) {
  const { colors } = useTheme();
  const { addToCart, getCantidad } = useCart();
  const descuento = calcularDescuento(disco.precioInicial, disco.precioActual);
  const enCarrito = getCantidad(disco.id) > 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        <Image source={resolveImagen(disco.imagen)} style={styles.image} resizeMode="cover" />
        {descuento > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{descuento}%</Text>
          </View>
        )}

        {/* Ícono de agregar al carrito, directo desde el catálogo */}
        <TouchableOpacity
          style={[
            styles.cartButton,
            { backgroundColor: enCarrito ? colors.green : colors.accent },
          ]}
          onPress={(e) => {
            e.stopPropagation?.();
            addToCart(disco, 1);
          }}
          activeOpacity={0.8}
        >
          {enCarrito ? (
            <Check color="#fff" size={16} strokeWidth={3} />
          ) : (
            <Plus color="#fff" size={16} strokeWidth={3} />
          )}
        </TouchableOpacity>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:         { borderRadius: 28, overflow: 'hidden', borderWidth: 1 },
  imageWrapper: { position: 'relative', width: '100%', aspectRatio: 1, overflow: 'hidden' },
  image:        { width: '100%', height: '100%' },

  badge:        {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: '#fec3b1', paddingHorizontal: 8,
    paddingVertical: 4, borderRadius: 10,
  },
  badgeText:    { color: '#fff', fontSize: 11, fontWeight: '800' },

  cartButton: {
    position: 'absolute', bottom: 10, right: 10,
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },

  info:         { padding: 12 },
  nombre:       { fontSize: 14, fontWeight: '700' },
  artista:      { fontSize: 12, marginTop: 3 },

  precioRow:    { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  precioActual: { fontSize: 14, fontWeight: '700' },
  precioInicial:{ fontSize: 12, textDecorationLine: 'line-through' },
});