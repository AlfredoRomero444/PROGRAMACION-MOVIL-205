import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Search } from 'lucide-react-native';

import { discos, artistas } from '../services/DiscosService';
import ArtistaCard from '../components/ArtistaCard';
import DiscoCard from '../components/DiscoCard';
import { resolveImagen } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { ArtistaScreenProps } from '../navigation/ExploreStack';

type Filtro = 'Todos' | 'Artistas' | 'Álbumes';

export default function ArtistaScreen({ navigation, route }: Partial<ArtistaScreenProps>) {
  const { colors } = useTheme();
  const [filtro, setFiltro] = useState<Filtro>(route?.params?.filtroInicial ?? 'Todos');

  const filtros: Filtro[] = ['Todos', 'Artistas', 'Álbumes'];

  // Tendencia: los primeros artistas del catálogo
  const tendencia = useMemo(() => artistas.slice(0, 6), []);

  // Destacado fijo, igual que en HomeScreen (Asyd G)
  const destacado = discos.find((d) => d.id === 16);
  const artistaDestacado = destacado
    ? artistas.find((a) => a.id === destacado.artistaId)
    : undefined;

  // Últimos álbumes agregados (los más recientes del catálogo)
  const ultimosAlbumes = useMemo(() => discos.slice(-6).reverse(), []);

  const irAlDetalle = (discoId: number) => {
    const disco = discos.find((d) => d.id === discoId)!;
    const artista = artistas.find((a) => a.id === disco.artistaId);
    navigation?.navigate('ExploreDetail', { disco, artista });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── CABECERA ── */}
      <Text style={[styles.sectionLabel, { color: colors.accent }]}>
        NOVEDADES
      </Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Lo último en{'\n'}la música
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Artistas en tendencia, lanzamientos y álbumes recién llegados.
      </Text>

      {/* ── BUSCADOR (visual, mismo estilo que el resto de la app) ── */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
        ]}
      >
        <Search color={colors.textSecondary} size={18} strokeWidth={2} />
        <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
          Buscar artistas o álbumes
        </Text>
      </View>

      {/* ── FILTROS (equivalente a las pestañas All / Videos / MP3s / Albums) ── */}
      <View
        style={[
          styles.filtrosWrap,
          { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
        ]}
      >
        {filtros.map((item) => {
          const activo = item === filtro;
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.filtroChip,
                activo && { backgroundColor: colors.accent },
              ]}
              activeOpacity={0.85}
              onPress={() => setFiltro(item)}
            >
              <Text
                style={[
                  styles.filtroText,
                  { color: activo ? '#ffffff' : colors.textSecondary },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── TENDENCIA ── */}
      {filtro !== 'Álbumes' && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitleRow, { color: colors.textPrimary }]}>
              Tendencia
            </Text>
            <Text style={[styles.sectionAction, { color: colors.accent }]}>Ver todo</Text>
          </View>

          <FlatList
            horizontal
            data={tendencia}
            keyExtractor={(item) => `tendencia-${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tendenciaLista}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.tendenciaCard,
                  { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
                ]}
              >
                <Image
                  source={resolveImagen(item.imagen)}
                  style={styles.tendenciaImagen}
                  resizeMode="cover"
                />
                <View style={styles.tendenciaOverlay} />
                <View style={styles.tendenciaInfo}>
                  <Text style={styles.tendenciaNombre} numberOfLines={1}>
                    {item.nombre}
                  </Text>
                  <Text style={styles.tendenciaGenero} numberOfLines={1}>
                    {item.genero}
                  </Text>
                </View>
              </View>
            )}
          />
        </>
      )}

      {/* ── DESTACADO (mismo estilo de banner que Home) ── */}
      {filtro === 'Todos' && destacado && (
        <View
          style={[
            styles.banner,
            { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
          ]}
        >
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTag, { color: colors.accent }]}>DESTACADO</Text>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {destacado.nombre}
            </Text>
            <Text style={[styles.bannerArtist, { color: colors.textSecondary }]}>
              {artistaDestacado?.nombre}
            </Text>
            <TouchableOpacity
              style={[styles.bannerBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.85}
              onPress={() => irAlDetalle(destacado.id)}
            >
              <Text style={styles.bannerBtnText}>Escuchar ahora</Text>
            </TouchableOpacity>
          </View>

          <Image source={resolveImagen(destacado.imagen)} style={styles.bannerImage} />
        </View>
      )}

      {/* ── ARTISTAS ── */}
      {filtro !== 'Álbumes' && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitleRow, { color: colors.textPrimary }]}>
              Todos los artistas
            </Text>
          </View>

          <View style={styles.artistasLista}>
            {artistas.map((artista) => {
              const primerDisco = discos.find((d) => d.artistaId === artista.id);
              return (
                <ArtistaCard
                  key={artista.id}
                  artista={artista}
                  onPress={primerDisco ? () => irAlDetalle(primerDisco.id) : undefined}
                />
              );
            })}
          </View>
        </>
      )}

      {/* ── ÚLTIMOS ÁLBUMES ── */}
      {filtro !== 'Artistas' && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitleRow, { color: colors.textPrimary }]}>
              Últimos álbumes
            </Text>
          </View>

          <View style={styles.albumesGrid}>
            {ultimosAlbumes.map((disco) => {
              const artista = artistas.find((a) => a.id === disco.artistaId);
              return (
                <View key={disco.id} style={styles.albumItem}>
                  <DiscoCard
                    disco={disco}
                    artistaNombre={artista?.nombre}
                    onPress={() => irAlDetalle(disco.id)}
                  />
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { padding: 25, paddingBottom: 60 },

  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:        { fontSize: 32, fontWeight: '900', marginTop: 10, letterSpacing: -0.5 },
  subtitle:     { fontSize: 14, lineHeight: 20, marginTop: 10, marginBottom: 20 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  searchPlaceholder: { fontSize: 14 },

  filtrosWrap: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    padding: 5,
    marginBottom: 26,
  },
  filtroChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroText: { fontSize: 13, fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  sectionTitleRow: { fontSize: 19, fontWeight: '700' },
  sectionAction:   { fontWeight: '600', fontSize: 13 },

  tendenciaLista: { paddingBottom: 26, gap: 14 },
  tendenciaCard: {
    width: 150,
    height: 190,
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 14,
  },
  tendenciaImagen: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  tendenciaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000055',
  },
  tendenciaInfo: { position: 'absolute', bottom: 14, left: 14, right: 14 },
  tendenciaNombre: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  tendenciaGenero: { color: '#ffffffcc', fontSize: 12, marginTop: 3 },

  banner: {
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  bannerContent: { flex: 1, marginRight: 15 },
  bannerTag:     { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  bannerTitle:   { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  bannerArtist:  { fontSize: 14, marginTop: 5 },
  bannerBtn: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
  },
  bannerBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  bannerImage:   { width: 100, height: 100, borderRadius: 20 },

  artistasLista: { gap: 12, marginBottom: 8 },

  albumesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  albumItem: { width: '48%', marginBottom: 16 },
});
