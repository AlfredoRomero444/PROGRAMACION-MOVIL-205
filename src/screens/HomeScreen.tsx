import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionLabel, { color: colors.accent }]}>
        DESCUBRE NUEVA MÚSICA
      </Text>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Welcome to{'\n'}Asyd Core.✧⋆
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Explora artistas, álbumes y colecciones exclusivas.
      </Text>

      {/* BANNER */}
      {destacado && (
        <View style={[styles.banner, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder, shadowColor: colors.accent }]}>
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

      {/* ARTISTAS */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
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

      {/* ÁLBUMES */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Álbumes populares
        </Text>
      </View>

      {productos.map(disco => {
        const artista = getArtesano(disco.artistaId);
        return (
          <View key={disco.id} style={[styles.albumCard, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder }]}>
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
  subtitle:      { fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 30 },

  banner: {
    borderRadius: 30, padding: 20, marginBottom: 30,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 4,
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
  sectionTitle:  { fontSize: 20, fontWeight: '700' },
  sectionAction: { fontWeight: '600' },

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