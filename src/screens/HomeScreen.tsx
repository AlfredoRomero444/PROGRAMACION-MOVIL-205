import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';

import {
  discos,
  artistas,
} from '../services/DiscosService';

export default function HomeScreen() {

  // ✅ DESTACADO FIJO (Asyd G)
  const destacado = discos.find(d => d.id === 16)!;

  const nuevosArtistas = artistas.slice(0, 8);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionLabel}>
        DESCUBRE NUEVA MÚSICA
      </Text>

      <Text style={styles.title}>
        Bienvenido a Pulse Music
      </Text>

      <Text style={styles.subtitle}>
        Explora artistas, álbumes y colecciones exclusivas.
      </Text>

      {/* 🔥 BANNER */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTag}>
            TENDENCIA
          </Text>

          <Text style={styles.bannerTitle}>
            {destacado.nombre}
          </Text>

          <Text style={styles.bannerArtist}>
            {
              artistas.find(a => a.id === destacado.artistaId)?.nombre
            }
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

      {/* ARTISTAS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Artistas destacados
        </Text>

        <Text style={styles.sectionAction}>
          Ver más
        </Text>
      </View>

      <FlatList
        horizontal
        data={nuevosArtistas}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artistList}
        renderItem={({ item }) => (
          <View style={styles.artistCard}>
            <Image
              source={
                typeof item.imagen === 'string'
                  ? { uri: item.imagen }
                  : item.imagen
              }
              style={styles.artistImage}
            />

            <Text numberOfLines={1} style={styles.artistName}>
              {item.nombre}
            </Text>

            <Text style={styles.artistGenre}>
              {item.genero}
            </Text>
          </View>
        )}
      />

      {/* ÁLBUMES */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Álbumes populares
        </Text>
      </View>

      {discos.map(disco => {
        const artista = artistas.find(
          a => a.id === disco.artistaId
        );

        return (
          <View key={disco.id} style={styles.albumCard}>
            <Image
              source={
                typeof disco.imagen === 'string'
                  ? { uri: disco.imagen }
                  : disco.imagen
              }
              style={styles.albumImage}
            />

            <View style={styles.albumInfo}>
              <Text style={styles.albumName}>
                {disco.nombre}
              </Text>

              <Text style={styles.albumArtist}>
                {artista?.nombre}
              </Text>

              <Text style={styles.albumPrice}>
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
  container: {
    flex: 1,
    backgroundColor: '#090912',
  },

  content: {
    padding: 25,
    paddingBottom: 120,
  },

  sectionLabel: {
    color: '#bf5af2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 10,
  },

  subtitle: {
    color: '#8e8e93',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 30,
  },

  banner: {
    backgroundColor: '#151525',
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  bannerContent: {
    flex: 1,
    marginRight: 15,
  },

  bannerTag: {
    color: '#bf5af2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  bannerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },

  bannerArtist: {
    color: '#8e8e93',
    fontSize: 15,
    marginTop: 6,
  },

  bannerImage: {
    width: 110,
    height: 110,
    borderRadius: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },

  sectionAction: {
    color: '#bf5af2',
    fontWeight: '600',
  },

  artistList: {
    paddingBottom: 15,
  },

  artistCard: {
    width: 120,
    marginRight: 15,
  },

  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 10,
  },

  artistName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  artistGenre: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 4,
  },

  albumCard: {
    backgroundColor: '#151525',
    borderRadius: 24,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  albumImage: {
    width: 75,
    height: 75,
    borderRadius: 18,
  },

  albumInfo: {
    flex: 1,
    marginLeft: 15,
  },

  albumName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  albumArtist: {
    color: '#8e8e93',
    fontSize: 14,
    marginTop: 5,
  },

  albumPrice: {
    color: '#32d74b',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
});