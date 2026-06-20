import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { discos, artistas } from '../services/DiscosService';
import DiscoCard from '../components/DiscoCard';
import ArtistaCard from '../components/ArtistaCard';

export default function ExploreScreen() {
  // Géneros únicos sacados de los artistas, en orden de aparición
  const generos = useMemo(() => {
    const vistos = new Set<string>();
    const lista: string[] = [];
    artistas.forEach((artista) => {
      if (!vistos.has(artista.genero)) {
        vistos.add(artista.genero);
        lista.push(artista.genero);
      }
    });
    return lista;
  }, []);

  const [generoActivo, setGeneroActivo] = useState(generos[0]);

  const artistasDelGenero = useMemo(
    () => artistas.filter((a) => a.genero === generoActivo),
    [generoActivo]
  );

  const discosDelGenero = useMemo(() => {
    const idsArtistas = artistasDelGenero.map((a) => a.id);
    return discos.filter((d) => idsArtistas.includes(d.artistaId));
  }, [artistasDelGenero]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>EXPLORA</Text>
        <Text style={styles.title}>By musical genre</Text>
        <Text style={styles.subtitle}>
          Encuentra artistas y discos según tu estilo
        </Text>
      </View>

      {/* Filtro de géneros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.generosScroll}
      >
        {generos.map((genero) => {
          const activo = genero === generoActivo;
          return (
            <TouchableOpacity
              key={genero}
              style={[styles.chip, activo && styles.chipActivo]}
              onPress={() => setGeneroActivo(genero)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.chipText,
                  activo && styles.chipTextActivo,
                ]}
                numberOfLines={1}
              >
                {genero}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={discosDelGenero}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <>
            {/* Artistas de este género */}
            <Text style={styles.subsectionTitle}>Artistas</Text>
            <View style={styles.artistasContainer}>
              {artistasDelGenero.map((artista) => (
                <ArtistaCard key={artista.id} artista={artista} />
              ))}
            </View>

            <Text style={styles.subsectionTitle}>Discos</Text>
          </>
        }
        renderItem={({ item }) => {
          const artista = artistas.find((a) => a.id === item.artistaId);
          return (
            <View style={styles.discoWrapper}>
              <DiscoCardHorizontal
                nombre={item.nombre}
                artista={artista?.nombre ?? ''}
                precio={item.precioActual}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            Aún no hay discos para este género.
          </Text>
        }
      />
    </View>
  );
}

// Variante horizontal ligera para la lista de discos del género,
// reutiliza el mismo lenguaje visual que DiscoCard pero en fila.
function DiscoCardHorizontal({
  nombre,
  artista,
  precio,
}: {
  nombre: string;
  artista: string;
  precio: number;
}) {
  return (
    <View style={styles.discoRow}>
      <View style={styles.discoDot} />
      <View style={styles.discoInfo}>
        <Text style={styles.discoNombre} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={styles.discoArtista} numberOfLines={1}>
          {artista}
        </Text>
      </View>
      <Text style={styles.discoPrecio}>${precio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
    paddingTop: 25,
  },

  header: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },

  sectionLabel: {
    color: '#bf5af2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: -1,
  },

  subtitle: {
    color: '#8e8e93',
    fontSize: 14,
    marginTop: 6,
  },

  generosScroll: {
    paddingHorizontal: 25,
    gap: 10,
    paddingBottom: 22,
    alignItems: 'center',
  },

  chip: {
    height: 40,
    minWidth: 70,
    backgroundColor: '#151525',
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff10',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipActivo: {
    backgroundColor: '#bf5af2',
    borderColor: '#bf5af2',
  },

  chipText: {
    color: '#8e8e93',
    fontSize: 13,
    fontWeight: '700',
  },

  chipTextActivo: {
    color: '#ffffff',
  },

  lista: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },

  subsectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 6,
  },

  artistasContainer: {
    gap: 12,
    marginBottom: 28,
  },

  discoWrapper: {
    marginBottom: 12,
  },

  discoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151525',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  discoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bf5af2',
    marginRight: 12,
  },

  discoInfo: {
    flex: 1,
  },

  discoNombre: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  discoArtista: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 3,
  },

  discoPrecio: {
    color: '#32d74b',
    fontSize: 14,
    fontWeight: '700',
  },

  vacio: {
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});