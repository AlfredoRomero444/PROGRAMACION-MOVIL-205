import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';

import { discos, artistas } from '../services/DiscosService';
import DiscoCard from '../components/DiscoCard';

export default function StoreScreen() {
  const [busqueda, setBusqueda] = useState('');

  const discosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return discos;

    return discos.filter((disco) => {
      const artista = artistas.find((a) => a.id === disco.artistaId);
      return (
        disco.nombre.toLowerCase().includes(termino) ||
        artista?.nombre.toLowerCase().includes(termino)
      );
    });
  }, [busqueda]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>CATÁLOGO</Text>
        <Text style={styles.title}>Music Store</Text>
        <Text style={styles.subtitle}>
          {discos.length} discos disponibles para coleccionar
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar disco o artista"
        placeholderTextColor="#8e8e93"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={discosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const artista = artistas.find((a) => a.id === item.artistaId);
          return (
            <View style={styles.cardWrapper}>
              <DiscoCard disco={item} artistaNombre={artista?.nombre} />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            No encontramos discos con ese nombre.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
    paddingTop: 25,
    paddingHorizontal: 25,
  },

  header: {
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

  searchInput: {
    backgroundColor: '#151525',
    color: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff10',
    fontSize: 14,
  },

  lista: {
    paddingBottom: 30,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  cardWrapper: {
    width: '48%',
  },

  vacio: {
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});