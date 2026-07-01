import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, TextInput,
} from 'react-native';
import { Search, X } from 'lucide-react-native';

import { discos, artistas } from '../services/DiscosService';
import DiscoCard from '../components/DiscoCard';
import ArtistaCard from '../components/ArtistaCard';
import { ExploreListProps } from '../navigation/ExploreStack';
import { useTheme } from '../context/ThemeContext';

export default function ExploreScreen({ navigation }: ExploreListProps) {
  const { colors } = useTheme();

  const generos = useMemo(() => {
    const vistos = new Set<string>();
    const lista: string[] = [];
    artistas.forEach((a) => {
      if (!vistos.has(a.genero)) { vistos.add(a.genero); lista.push(a.genero); }
    });
    return lista;
  }, []);

  const [generoActivo, setGeneroActivo] = useState(generos[0]);
  const [busqueda, setBusqueda] = useState('');

  // Filtra las burbujas de género según lo que el usuario escriba, sin
  // afectar el ancho/alto de cada una (nunca se recortan).
  const generosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return generos;
    return generos.filter((g) => g.toLowerCase().includes(q));
  }, [busqueda, generos]);

  // Si el género activo desaparece de la búsqueda, activamos el primero
  // de los resultados visibles para que la lista de abajo siga teniendo sentido.
  useEffect(() => {
    if (generosFiltrados.length === 0) return;
    if (!generosFiltrados.includes(generoActivo)) {
      setGeneroActivo(generosFiltrados[0]);
    }
  }, [generosFiltrados]);

  const artistasDelGenero = useMemo(
    () => artistas.filter((a) => a.genero === generoActivo),
    [generoActivo]
  );

  const discosDelGenero = useMemo(() => {
    const ids = artistasDelGenero.map((a) => a.id);
    return discos.filter((d) => ids.includes(d.artistaId));
  }, [artistasDelGenero]);

  const irAlDetalle = (discoId: number) => {
    const disco   = discos.find((d) => d.id === discoId)!;
    const artista = artistas.find((a) => a.id === disco.artistaId);
    navigation.navigate('ExploreDetail', { disco, artista });
  };

  // Evita que la lista de abajo "salte" (rebote hacia arriba/abajo) al
  // cambiar de burbuja de género: siempre la regresamos al tope de forma
  // inmediata, sin animación, así la fila de géneros queda fija en su lugar.
  const listRef = useRef<FlatList>(null);
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [generoActivo]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionLabel, { color: colors.accent }]}>EXPLORA</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>By musical genre</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Encuentra artistas y álbumes según tu estilo
        </Text>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
          ]}
        >
          <Search color={colors.textSecondary} size={18} strokeWidth={2} />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar por género…"
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.textPrimary }]}
            returnKeyType="search"
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')} hitSlop={8}>
              <X color={colors.textSecondary} size={18} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Fila de géneros: altura fija (no se recorta ni se mueve al
          cambiar de pestaña, siempre queda como una línea estable). */}
      <View style={styles.generosWrap}>
        {generosFiltrados.length === 0 ? (
          <Text style={[styles.sinResultados, { color: colors.textSecondary }]}>
            Sin resultados para "{busqueda}"
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.generosScroll}
          >
            {generosFiltrados.map((genero) => {
              const activo = genero === generoActivo;
              return (
                <TouchableOpacity
                  key={genero}
                  style={[
                    styles.chip,
                    { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
                    activo && styles.chipActivo,
                  ]}
                  onPress={() => setGeneroActivo(genero)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: colors.textSecondary },
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
        )}
      </View>

      <FlatList
        ref={listRef}
        data={discosDelGenero}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <>
            <Text style={[styles.subsectionTitle, { color: colors.textPrimary }]}>Artistas</Text>
            <View style={styles.artistasContainer}>
              {artistasDelGenero.map((artista) => (
                <ArtistaCard key={artista.id} artista={artista} />
              ))}
            </View>
            <Text style={[styles.subsectionTitle, { color: colors.textPrimary }]}>Discos</Text>
          </>
        }
        renderItem={({ item }) => {
          const artista = artistas.find((a) => a.id === item.artistaId);
          return (
            <View style={styles.discoWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => irAlDetalle(item.id)}
              >
                <View
                  style={[
                    styles.discoRow,
                    { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
                  ]}
                >
                  <View style={[styles.discoDot, { backgroundColor: colors.accent }]} />
                  <View style={styles.discoInfo}>
                    <Text style={[styles.discoNombre, { color: colors.textPrimary }]} numberOfLines={1}>{item.nombre}</Text>
                    <Text style={[styles.discoArtista, { color: colors.textSecondary }]} numberOfLines={1}>{artista?.nombre}</Text>
                  </View>
                  <Text style={[styles.discoPrecio, { color: colors.green }]}>${item.precioActual}</Text>
                  <Text style={[styles.chevron, { color: colors.accent }]}>›</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.vacio, { color: colors.textSecondary }]}>Aún no hay discos para este género.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, paddingTop: 25 },
  header:           { paddingHorizontal: 25, marginBottom: 16 },
  sectionLabel:     { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:            { fontSize: 32, fontWeight: '900', marginTop: 8, letterSpacing: -1 },
  subtitle:         { fontSize: 14, marginTop: 6 },
  searchBox:        { flexDirection: 'row', alignItems: 'center', gap: 8,
                      height: 46, borderRadius: 14, borderWidth: 1,
                      paddingHorizontal: 14, marginTop: 18 },
  searchInput:      { flex: 1, fontSize: 14, height: '100%' },
  // Altura fija: las burbujas nunca se recortan y la fila no cambia de
  // tamaño ni de posición al cambiar de género o al buscar.
  generosWrap:      { height: 62, justifyContent: 'center' },
  generosScroll:    { paddingHorizontal: 25, gap: 10, alignItems: 'center', flexGrow: 1 },
  sinResultados:    { paddingHorizontal: 25, fontSize: 13 },
  chip:             { height: 40, minWidth: 70, paddingHorizontal: 16,
                      borderRadius: 20, borderWidth: 1,
                      alignItems: 'center', justifyContent: 'center' },
  chipActivo:       { backgroundColor: '#fec3b1', borderColor: '#fec3b1' },
  chipText:         { fontSize: 13, fontWeight: '700' },
  chipTextActivo:   { color: '#ffffff' },
  lista:            { paddingHorizontal: 25, paddingBottom: 30 },
  subsectionTitle:  { fontSize: 16, fontWeight: '700', marginBottom: 14, marginTop: 6 },
  artistasContainer:{ gap: 12, marginBottom: 28 },
  discoWrapper:     { marginBottom: 12 },
  discoRow:         { flexDirection: 'row', alignItems: 'center',
                      borderRadius: 22, padding: 14, borderWidth: 1 },
  discoDot:         { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  discoInfo:        { flex: 1 },
  discoNombre:      { fontSize: 14, fontWeight: '700' },
  discoArtista:     { fontSize: 12, marginTop: 3 },
  discoPrecio:      { fontSize: 14, fontWeight: '700', marginRight: 8 },
  chevron:          { fontSize: 20, fontWeight: '300' },
  vacio:            { textAlign: 'center', marginTop: 40, fontSize: 14 },
});
