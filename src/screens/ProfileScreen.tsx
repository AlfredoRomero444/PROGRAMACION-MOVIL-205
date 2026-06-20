import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function ProfileScreen() {
  const usuario = {
    nombre: 'Asyd G',
    correo: 'asydg1@gmail.com',
    cancionesEscuchadas: 1284,
    artistasSeguidos: 36,
    playlists: 8,
  };

  const artistasFavoritos = [
    {
      id: '1',
      nombre: 'The Weeknd',
      imagen: 'https://i.pinimg.com/736x/53/5d/b1/535db164872512b7a87d9a4ed9104c85.jpg',
    },
    {
      id: '2',
      nombre: 'OPYI',
      imagen: 'https://i.pinimg.com/736x/b7/a0/62/b7a0627eacddc949efa2d52aa5486b87.jpg',
    },
    {
      id: '3',
      nombre: 'Rels B',
      imagen: 'https://i.pinimg.com/736x/0a/ea/f4/0aeaf426a74543b360aacbd1530f81ee.jpg',
    },
    {
      id: '4',
      nombre: 'Charles Ans',
      imagen: 'https://i.pinimg.com/1200x/c2/d9/66/c2d9661223e73dc22fa0b21a5ae78319.jpg',
    },
    {
      id: '5',
      nombre: 'Samantha Barron',
      imagen: 'https://i.pinimg.com/1200x/f4/b0/c2/f4b0c21857157685233273b8ff1533b1.jpg',
    
    },
      {
      id: '6',
      nombre: 'Gera MX',
      imagen: 'https://i.pinimg.com/736x/59/6b/2a/596b2aa28086534e972c16851ec4dfa2.jpg',
    },
    
  ];

  const generosFavoritos = ['Pop', 'Hip-Hop', 'Rap','R&B soul'];

  const [ping, setPing] = useState(42);
  const [requests, setRequests] = useState(1);
  const [uptime, setUptime] = useState(0);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const pingTimer = setInterval(() => {
      setPing(Math.floor(Math.random() * 60) + 30);
    }, 2000);

    const reqTimer = setInterval(() => {
      setRequests((r) => r + 1);
    }, 3500);

    const uptimeTimer = setInterval(() => {
      setUptime((u) => u + 1);
    }, 1000);

    const blinkTimer = setInterval(() => {
      setBlink((b) => !b);
    }, 800);

    return () => {
      clearInterval(pingTimer);
      clearInterval(reqTimer);
      clearInterval(uptimeTimer);
      clearInterval(blinkTimer);
    };
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Portada */}
      <View style={styles.cover}>
        <Image
          source={require('../../assets/HasleyLuke.jpg')}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require('../../assets/profile.jpg')}
          style={styles.avatar}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.correo}>{usuario.correo}</Text>

        {/* Estadísticas */}
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

        {/* Top artistas */}
        <Text style={styles.sectionTitle}>Top artistas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.artistasScroll}
        >
          {artistasFavoritos.map((artista) => (
            <View key={artista.id} style={styles.artistaItem}>
              <Image
                source={{ uri: artista.imagen }}
                style={styles.artistaAvatar}
              />
              <Text style={styles.artistaNombre} numberOfLines={1}>
                {artista.nombre}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Géneros */}
        <Text style={styles.sectionTitle}>Géneros favoritos</Text>
        <View style={styles.generosContainer}>
          {generosFavoritos.map((genero) => (
            <View key={genero} style={styles.generoBadge}>
              <Text style={styles.generoText}>{genero}</Text>
            </View>
          ))}
        </View>

        {/* ── API Monitor ───────────────────────────────────────── */}
        <View style={styles.apiCard}>
          {/* Header */}
          <View style={styles.apiHeader}>
            <View style={styles.apiHeaderLeft}>
              <View style={[styles.apiDot, { opacity: blink ? 1 : 0.2 }]} />
              <Text style={styles.apiTitle}>API STATUS</Text>
            </View>
            <View style={styles.apiBadge}>
              <Text style={styles.apiBadgeText}>ACTIVO</Text>
            </View>
          </View>

          {/* Métricas */}
          <View style={styles.apiMetrics}>
            <View style={styles.apiMetricBox}>
              <Text style={styles.apiMetricValue}>{ping}ms</Text>
              <Text style={styles.apiMetricLabel}>PING</Text>
            </View>
            <View style={styles.apiMetricDivider} />
            <View style={styles.apiMetricBox}>
              <Text style={styles.apiMetricValue}>{requests}</Text>
              <Text style={styles.apiMetricLabel}>REQUESTS</Text>
            </View>
            <View style={styles.apiMetricDivider} />
            <View style={styles.apiMetricBox}>
              <Text style={styles.apiMetricValue}>{uptime}s</Text>
              <Text style={styles.apiMetricLabel}>UPTIME</Text>
            </View>
          </View>

          {/* JSON */}
          <View style={styles.apiJsonBox}>
            <Text style={styles.apiJsonLine}>
              <Text style={styles.apiKey}>"status"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueStr}>"success"</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLine}>
              <Text style={styles.apiKey}>"code"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueNum}>200</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>

            {/* Endpoint tappable */}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://github.com/AlfredoRomero444/PROGRAMACION-MOVIL-205')
              }
            >
              <Text style={styles.apiJsonLine}>
                <Text style={styles.apiKey}>"endpoint"</Text>
                <Text style={styles.apiColon}>: </Text>
                <Text style={[styles.apiValueStr, styles.apiLink]}>
                  "https://github.com/AlfredoRomero444/PROGRAMACION-MOVIL-205"
                </Text>
                <Text style={styles.apiPunct}>,</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.apiJsonLine}>
              <Text style={styles.apiKey}>"data"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiPunct}>{'{'}</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"userId"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueStr}>"asydg_001"</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"nombre"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueStr}>"Asyd G"</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"canciones"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueNum}>{usuario.cancionesEscuchadas}</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"artistas"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueNum}>{usuario.artistasSeguidos}</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"playlists"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueNum}>{usuario.playlists}</Text>
            </Text>
            <Text style={styles.apiJsonLine}>
              <Text style={styles.apiPunct}>{'}'}</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLine}>
              <Text style={styles.apiKey}>"meta"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiPunct}>{'{'}</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"ping"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueStr}>"{ping}ms"</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"requests"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueNum}>{requests}</Text>
              <Text style={styles.apiPunct}>,</Text>
            </Text>
            <Text style={styles.apiJsonLineIndent}>
              <Text style={styles.apiKey}>"uptime"</Text>
              <Text style={styles.apiColon}>: </Text>
              <Text style={styles.apiValueStr}>"{uptime}s"</Text>
            </Text>
            <Text style={styles.apiJsonLine}>
              <Text style={styles.apiPunct}>{'}'}</Text>
            </Text>
          </View>
        </View>
        {/* ─────────────────────────────────────────────────────── */}

        {/* Opciones — al fondo */}
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
  container: { flex: 1, backgroundColor: '#090912' },

  cover: { height: 150, overflow: 'hidden' },
  coverImage: { width: '100%', height: '100%' },

  settingsButton: {
    position: 'absolute', top: 14, right: 16,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#ffffff20',
    alignItems: 'center', justifyContent: 'center',
  },
  settingsIcon: { color: '#fff', fontSize: 16 },

  avatarWrapper: { marginTop: -AVATAR_SIZE / 2, paddingLeft: 20 },
  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3, borderColor: '#090912',
  },

  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },

  nombre: { color: '#fff', fontSize: 19, fontWeight: '700', fontFamily: 'monospace' },
  correo: { color: '#8e8e93', fontSize: 13, marginTop: 2, marginBottom: 18 },

  statsRow: {
    flexDirection: 'row', paddingVertical: 14,
    borderTopWidth: 0.5, borderBottomWidth: 0.5,
    borderColor: '#ffffff1a', marginBottom: 22,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 0.5, backgroundColor: '#ffffff1a' },
  statNumero: { color: '#fff', fontSize: 17, fontWeight: '700' },
  statLabel: { color: '#8e8e93', fontSize: 11, marginTop: 3 },

  sectionTitle: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 10 },

  artistasScroll: { gap: 14, paddingBottom: 22 },
  artistaItem: { width: 64, alignItems: 'center' },
  artistaAvatar: {
    width: 56, height: 56, borderRadius: 28,
    marginBottom: 6, backgroundColor: '#1a1a2e',
  },
  artistaNombre: { color: '#d3d1c7', fontSize: 11, textAlign: 'center' },

  generosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  generoBadge: {
    backgroundColor: '#bf5af226',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
  },
  generoText: { color: '#d4a8f5', fontSize: 12, fontWeight: '600' },

  optionsContainer: { marginTop: 14 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 14,
    borderTopWidth: 0.5, borderColor: '#ffffff1a',
  },
  optionText: { color: '#fff', fontSize: 14 },
  optionArrow: { color: '#8e8e93', fontSize: 18 },
  logoutRow: { paddingBottom: 4 },
  logoutText: { color: '#e24b4a', fontSize: 14 },

  // ── API Monitor ────────────────────────────────────────────────
  apiCard: {
    marginTop: 28,
    backgroundColor: '#0e0b1a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bf5af230',
    overflow: 'hidden',
  },
  apiHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderColor: '#bf5af220',
    backgroundColor: '#160d26',
  },
  apiHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  apiDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#bf5af2',
  },
  apiTitle: {
    color: '#bf5af2', fontSize: 11,
    fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2,
  },
  apiBadge: {
    backgroundColor: '#bf5af220',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, borderWidth: 1, borderColor: '#bf5af250',
  },
  apiBadgeText: {
    color: '#d4a8f5', fontSize: 10,
    fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1,
  },
  apiMetrics: {
    flexDirection: 'row', paddingVertical: 12,
    borderBottomWidth: 1, borderColor: '#bf5af215',
  },
  apiMetricBox: { flex: 1, alignItems: 'center' },
  apiMetricDivider: { width: 1, backgroundColor: '#bf5af220' },
  apiMetricValue: {
    color: '#d4a8f5', fontSize: 16,
    fontWeight: '700', fontFamily: 'monospace',
  },
  apiMetricLabel: {
    color: '#7a5a99', fontSize: 9,
    fontFamily: 'monospace', letterSpacing: 1, marginTop: 2,
  },
  apiJsonBox: { padding: 14, backgroundColor: '#0a0714' },
  apiJsonLine: { marginBottom: 2 },
  apiJsonLineIndent: { marginBottom: 2, paddingLeft: 14 },
  apiKey: { color: '#c792ea', fontSize: 11, fontFamily: 'monospace' },
  apiColon: { color: '#7a5a99', fontSize: 11, fontFamily: 'monospace' },
  apiValueStr: { color: '#a8d8a8', fontSize: 11, fontFamily: 'monospace' },
  apiValueNum: { color: '#bf5af2', fontSize: 11, fontFamily: 'monospace' },
  apiPunct: { color: '#5a4a7a', fontSize: 11, fontFamily: 'monospace' },
  apiLink: {
    textDecorationLine: 'underline',
    color: '#a8d8a8',
  },
});