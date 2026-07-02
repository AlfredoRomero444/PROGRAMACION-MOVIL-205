import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Artista } from '../types';
import { resolveImagen } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

type ArtistaCardProps = {
  artista: Artista;
  onPress?: () => void;
};

export default function ArtistaCard({ artista, onPress }: ArtistaCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={resolveImagen(artista.imagen)} style={styles.imagen} />

      <View style={styles.info}>
        <Text style={[styles.nombre, { color: colors.textPrimary }]} numberOfLines={1}>
          {artista.nombre}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.generoBadge, { backgroundColor: colors.tagBg, borderColor: colors.tagBorder, borderWidth: 1 }]}>
            <Text style={[styles.generoText, { color: colors.accentLight }]}>{artista.genero}</Text>
          </View>
          <Text style={[styles.pais, { color: colors.textSecondary }]}>{artista.pais}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:       {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 24, padding: 12, borderWidth: 1,
  },
  imagen:     { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  info:       { flex: 1 },
  nombre:     { fontSize: 15, fontWeight: '700' },
  metaRow:    { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  generoBadge:{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  generoText: { fontSize: 11, fontWeight: '600' },
  pais:       { fontSize: 12 },
});