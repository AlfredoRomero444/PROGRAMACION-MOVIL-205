import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, Disc3, Library, Sparkles, ChevronRight } from 'lucide-react-native';

import { useProductos } from '../hooks/useProductos';
import { useTheme } from '../context/ThemeContext';

function LoadingSymbols() {
  const dot   = useRef(new Animated.Value(0)).current;
  const star  = useRef(new Animated.Value(0)).current;
  const spark = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        ])
      ).start();

    pulse(dot,   0);
    pulse(star,  200);
    pulse(spark, 400);
  }, []);

  const dotStyle   = { opacity: dot,   transform: [{ scale: dot.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }] };
  const starStyle  = { opacity: star,  transform: [{ scale: star.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.4] }) }] };
  const sparkStyle = { opacity: spark, transform: [{ scale: spark.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.3] }) }] };

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.symbolsRow}>
        <Animated.Text style={[styles.symbol, dotStyle]}>.</Animated.Text>
        <Animated.Text style={[styles.symbol, starStyle]}>✧</Animated.Text>
        <Animated.Text style={[styles.symbol, sparkStyle]}>⋆</Animated.Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { productos, cargando, getArtesano } = useProductos();
  const { colors, theme } = useTheme();
  const navigation = useNavigation<any>();

  // Oculta header y tab bar mientras carga, los restaura al terminar
  useEffect(() => {
    const parent = navigation.getParent();
    if (cargando) {
      navigation.setOptions({ headerShown: false });
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ headerShown: true });
      parent?.setOptions({
        tabBarStyle: {
          display: 'flex',
          backgroundColor: colors.tabBar,
          borderTopWidth: 1.5,
          borderTopColor: colors.tabBorder,
          height: 60,
          paddingTop: 4,
          paddingBottom: 8,
        },
      });
    }
  }, [cargando, colors]);

  if (cargando) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <LoadingSymbols />
      </View>
    );
  }

  // DESTACADO FIJO (Asyd G)
  const destacado = productos.find(d => d.id === 16)!;

  const nuevosArtistas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map(id => getArtesano(id))
    .filter(Boolean)
    .slice(0, 8);

  // NAVEGACIÓN RÁPIDA — ahora en formato lista (sin burbujas circulares)
  const navegacionRapida = [
    { label: 'Artistas',    desc: 'Descubre nuevos artistas',      Icon: Search,   tab: 'Explorar'  },
    { label: 'Álbumes',     desc: 'Explora álbumes destacados',    Icon: Disc3,    tab: 'Tienda'     },
    { label: 'Colecciones', desc: 'Escucha colecciones exclusivas',Icon: Library,  tab: 'Colección'  },
    { label: 'Novedades',   desc: 'Lo último en la música',        Icon: Sparkles, tab: 'Explorar', screen: 'Artista' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── CABECERA ── */}
      <Text style={[styles.sectionLabel, { color: colors.accent }]}>
        DESCUBRE NUEVA MÚSICA
      </Text>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Welcome to{'\n'}Asyd Core.✧⋆
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Explora artistas, álbumes y colecciones exclusivas.
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.accentBorder }]} />

      {/* ── EXPLORA LA MÚSICA — navegación en lista, sin burbujas ── */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Explora la música
      </Text>

      <View
        style={[
          styles.navList,
          { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
        ]}
      >
        {navegacionRapida.map(({ label, desc, Icon, tab, screen }, index) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.navRow,
              index !== navegacionRapida.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            activeOpacity={0.75}
            onPress={() =>
              screen
                ? navigation.navigate(tab, { screen })
                : navigation.navigate(tab)
            }
          >
            <View style={[styles.navIconWrap, { backgroundColor: colors.accentFaint }]}>
              <Icon color={colors.accent} size={18} strokeWidth={2} />
            </View>

            <View style={styles.navTextWrap}>
              <Text style={[styles.navLabel, { color: colors.textPrimary }]}>{label}</Text>
              <Text style={[styles.navDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                {desc}
              </Text>
            </View>

            <ChevronRight color={colors.textSecondary} size={18} strokeWidth={2} />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── BANNER DESTACADO ── */}
      {destacado && (
        <View
          style={[
            styles.banner,
            { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
          ]}
        >
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTag, { color: colors.accent }]}>
              TENDENCIA
            </Text>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
              {destacado.nombre}
            </Text>
            <Text style={[styles.bannerArtist, { color: colors.textSecondary }]}>
              {getArtesano(destacado.artistaId)?.nombre}
            </Text>
          </View>

          <Image
            source={
              typeof destacado.imagen === 'string'
                ? { uri: destacado.imagen }
                : destacado.imagen
            }
            style={styles.bannerImage}
          />
        </View>
      )}

      {/* ── ARTISTAS ── */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitleRow, { color: colors.textPrimary }]}>
          Artistas destacados
        </Text>
        <Text style={[styles.sectionAction, { color: colors.accent }]}>
          Ver más
        </Text>
      </View>

      <FlatList
        horizontal
        data={nuevosArtistas}
        keyExtractor={item => item!.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artistList}
        renderItem={({ item }) => (
          <View style={styles.artistCard}>
            <Image
              source={
                typeof item!.imagen === 'string'
                  ? { uri: item!.imagen }
                  : item!.imagen
              }
              style={styles.artistImage}
            />
            <Text numberOfLines={1} style={[styles.artistName, { color: colors.textPrimary }]}>
              {item!.nombre}
            </Text>
            <Text style={[styles.artistGenre, { color: colors.textSecondary }]}>
              {item!.genero}
            </Text>
          </View>
        )}
      />

      {/* ── ÁLBUMES ── */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitleRow, { color: colors.textPrimary }]}>
          Álbumes populares
        </Text>
      </View>

      {productos.map(disco => {
        const artista = getArtesano(disco.artistaId);
        return (
          <View
            key={disco.id}
            style={[
              styles.albumCard,
              { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
            ]}
          >
            <Image
              source={
                typeof disco.imagen === 'string'
                  ? { uri: disco.imagen }
                  : disco.imagen
              }
              style={styles.albumImage}
            />
            <View style={styles.albumInfo}>
              <Text style={[styles.albumName, { color: colors.textPrimary }]}>
                {disco.nombre}
              </Text>
              <Text style={[styles.albumArtist, { color: colors.textSecondary }]}>
                {artista?.nombre}
              </Text>
              <Text style={[styles.albumPrice, { color: colors.green }]}>
                Desde ${disco.precioActual}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { padding: 25, paddingBottom: 120 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  symbol:     { color: '#fec3b1', fontSize: 48, fontWeight: '300' },

  sectionLabel:  { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:         { fontSize: 34, fontWeight: '900', marginTop: 10 },
  subtitle:      { fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 22 },

  divider: { height: 1, width: 40, marginBottom: 22 },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },

  // ── Lista de navegación (reemplaza las burbujas circulares) ──
  navList: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 6,
    marginBottom: 28,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 14,
  },
  navIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextWrap: { flex: 1 },
  navLabel:    { fontSize: 15, fontWeight: '700' },
  navDesc:     { fontSize: 12, marginTop: 2 },

  banner: {
    borderRadius: 30, padding: 20, marginBottom: 30,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
  },
  bannerContent: { flex: 1, marginRight: 15 },
  bannerTag:     { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  bannerTitle:   { fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  bannerArtist:  { fontSize: 15, marginTop: 6 },
  bannerImage:   { width: 110, height: 110, borderRadius: 20 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 18, marginTop: 10,
  },
  sectionTitleRow: { fontSize: 20, fontWeight: '700' },
  sectionAction:   { fontWeight: '600' },

  artistList:  { paddingBottom: 15 },
  artistCard:  { width: 120, marginRight: 15 },
  artistImage: { width: 120, height: 120, borderRadius: 24, marginBottom: 10 },
  artistName:  { fontSize: 14, fontWeight: '700' },
  artistGenre: { fontSize: 12, marginTop: 4 },

  albumCard:   {
    borderRadius: 24, padding: 15,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 15, borderWidth: 1,
  },
  albumImage:  { width: 75, height: 75, borderRadius: 18 },
  albumInfo:   { flex: 1, marginLeft: 15 },
  albumName:   { fontSize: 17, fontWeight: '700' },
  albumArtist: { fontSize: 14, marginTop: 5 },
  albumPrice:  { fontSize: 15, fontWeight: '700', marginTop: 10 },
});
