import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function ProfileScreen() {
  // Datos de ejemplo - luego los conectas a tu backend/estado real
  const usuario = {
    nombre: 'Juan Pérez',
    correo: 'juan.perez@email.com',
    iniciales: 'JP',
    cancionesEscuchadas: 1284,
    artistasSeguidos: 36,
    playlists: 8,
  };

  const artistasFavoritos = [
    { id: '1', nombre: 'The Weeknd', color: '#1d9e75' },
    { id: '2', nombre: 'Dua Lipa', color: '#d4537e' },
    { id: '3', nombre: 'Bad Bunny', color: '#d85a30' },
  ];

  const generosFavoritos = ['Pop', 'R&B', 'Reggaetón'];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header con cover + avatar superpuesto */}
      <View style={styles.cover}>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{usuario.iniciales}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.correo}>{usuario.correo}</Text>

        {/* Estadísticas en línea */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumero}>
              {usuario.cancionesEscuchadas.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>canciones</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumero}>{usuario.artistasSeguidos}</Text>
            <Text style={styles.statLabel}>artistas</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumero}>{usuario.playlists}</Text>
            <Text style={styles.statLabel}>playlists</Text>
          </View>
        </View>

        {/* Top artistas - scroll horizontal */}
        <Text style={styles.sectionTitle}>Top artistas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.artistasScroll}
        >
          {artistasFavoritos.map((artista) => (
            <View key={artista.id} style={styles.artistaItem}>
              <View
                style={[
                  styles.artistaAvatar,
                  { backgroundColor: artista.color },
                ]}
              />
              <Text style={styles.artistaNombre} numberOfLines={1}>
                {artista.nombre}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Géneros favoritos */}
        <Text style={styles.sectionTitle}>Géneros favoritos</Text>
        <View style={styles.generosContainer}>
          {generosFavoritos.map((genero) => (
            <View key={genero} style={styles.generoBadge}>
              <Text style={styles.generoText}>{genero}</Text>
            </View>
          ))}
        </View>

        {/* Opciones */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Editar perfil</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionRow, styles.logoutRow]}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const AVATAR_SIZE = 84;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
  },

  cover: {
    height: 150,
    backgroundColor: '#3a1c52',
  },

  settingsButton: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsIcon: {
    color: '#fff',
    fontSize: 16,
  },

  avatarWrapper: {
    marginTop: -AVATAR_SIZE / 2,
    paddingLeft: 20,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#bf5af2',
    borderWidth: 3,
    borderColor: '#090912',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#2c0d3d',
    fontSize: 28,
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  nombre: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },

  correo: {
    color: '#8e8e93',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ffffff1a',
    marginBottom: 22,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statDivider: {
    width: 0.5,
    backgroundColor: '#ffffff1a',
  },

  statNumero: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  statLabel: {
    color: '#8e8e93',
    fontSize: 11,
    marginTop: 3,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },

  artistasScroll: {
    gap: 14,
    paddingBottom: 22,
  },

  artistaItem: {
    width: 64,
    alignItems: 'center',
  },

  artistaAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
  },

  artistaNombre: {
    color: '#d3d1c7',
    fontSize: 11,
    textAlign: 'center',
  },

  generosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  generoBadge: {
    backgroundColor: '#bf5af226',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  generoText: {
    color: '#d4a8f5',
    fontSize: 12,
    fontWeight: '600',
  },

  optionsContainer: {
    marginTop: 14,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderColor: '#ffffff1a',
  },

  optionText: {
    color: '#fff',
    fontSize: 14,
  },

  optionArrow: {
    color: '#8e8e93',
    fontSize: 18,
  },

  logoutRow: {
    paddingBottom: 4,
  },

  logoutText: {
    color: '#e24b4a',
    fontSize: 14,
  },
});
