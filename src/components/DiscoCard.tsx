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

type DiscoCardProps = {
  disco: Disco;
  artistaNombre?: string;
  onPress?: () => void;
};

export default function DiscoCard({
  disco,
  artistaNombre,
  onPress,
}: DiscoCardProps) {
  const descuento = calcularDescuento(
    disco.precioInicial,
    disco.precioActual
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={resolveImagen(disco.imagen)}
          style={styles.image}
          resizeMode="cover"
        />
        {descuento > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{descuento}%</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {disco.nombre}
        </Text>

        {artistaNombre && (
          <Text style={styles.artista} numberOfLines={1}>
            {artistaNombre}
          </Text>
        )}

        <View style={styles.precioRow}>
          <Text style={styles.precioActual}>
            {formatPrecio(disco.precioActual)}
          </Text>
          {descuento > 0 && (
            <Text style={styles.precioInicial}>
              {formatPrecio(disco.precioInicial)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151525',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#bf5af2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  info: {
    padding: 12,
  },

  nombre: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  artista: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 3,
  },

  precioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },

  precioActual: {
    color: '#32d74b',
    fontSize: 14,
    fontWeight: '700',
  },

  precioInicial: {
    color: '#5e5e66',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
});