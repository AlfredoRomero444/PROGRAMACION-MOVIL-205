import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';

import { Search } from 'lucide-react-native';
import { discos, artistas } from '../services/DiscosService';
import DiscoCard from '../components/DiscoCard';
import { useTheme } from '../context/ThemeContext';
import { StoreListProps } from '../navigation/StoreStack';

export default function StoreScreen({ navigation }: StoreListProps) {
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionLabel, { color: colors.accent }]}>CATÁLOGO</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Music Store</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {discos.length} discos disponibles para coleccionar
        </Text>
      </View>

      <View
        style={[
          styles.searchWrapper,
          { backgroundColor: colors.bgInput, borderColor: colors.accentBorder },
        ]}
      >
        <Search color={colors.accent} size={17} strokeWidth={2} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Buscar disco o artista"
          placeholderTextColor={colors.textSecondary}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

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
              <DiscoCard
                disco={item}
                artistaNombre={artista?.nombre}
                onPress={() => navigation.navigate('StoreDetail', { disco: item, artista })}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.vacio, { color: colors.textSecondary }]}>
            No encontramos discos con ese nombre.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 25, paddingHorizontal: 25 },

  header:       { marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:        { fontSize: 32, fontWeight: '900', marginTop: 8, letterSpacing: -1 },
  subtitle:     { fontSize: 14, marginTop: 6 },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
  },

  lista:       { paddingBottom: 30 },
  row:         { justifyContent: 'space-between', marginBottom: 16 },
  cardWrapper: { width: '48%' },
  vacio:       { textAlign: 'center', marginTop: 40, fontSize: 14 },
});