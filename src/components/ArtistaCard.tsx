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
 
type ArtistaCardProps = {
  artista: Artista;
  onPress?: () => void;
};
 
export default function ArtistaCard({
  artista,
  onPress,
}: ArtistaCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={resolveImagen(artista.imagen)}
        style={styles.imagen}
      />
 
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {artista.nombre}
        </Text>
 
        <View style={styles.metaRow}>
          <View style={styles.generoBadge}>
            <Text style={styles.generoText}>{artista.genero}</Text>
          </View>
          <Text style={styles.pais}>{artista.pais}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151525',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },
 
  imagen: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
 
  info: {
    flex: 1,
  },
 
  nombre: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
 
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
 
  generoBadge: {
    backgroundColor: '#bf5af226',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
 
  generoText: {
    color: '#d4a8f5',
    fontSize: 11,
    fontWeight: '600',
  },
 
  pais: {
    color: '#8e8e93',
    fontSize: 12,
  },
});