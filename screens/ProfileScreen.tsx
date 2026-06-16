import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const nombre: string = 'ALFREDO GIRARTE ROMERO';
const carrera: string = 'Ingeniería en Sistemas Computacionales';
const generacion: number = 19;
const cuatrimestre: number = 10;
const promedio: number = 8.69;
const titulado: boolean = false;
const datoPendiente: null = null;

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.neonOrbit}>
          <Image
            source={require('../assets/perfil.jpg')}
            style={styles.profileImg}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.mainTitle}>{nombre}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>ESTUDIANTE</Text>
        </View>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>DATOS DEL PERFIL</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>CARRERA</Text>
          <Text style={styles.value}>{carrera}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>GENERACIÓN</Text>
          <Text style={styles.value}>{generacion}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.label}>CUATRIMESTRE</Text>
            <Text style={styles.statValue}>{cuatrimestre}°</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.label}>PROMEDIO</Text>
            <Text style={styles.statValue}>{promedio}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>ESTADO TITULACIÓN</Text>
          <Text style={[styles.value, !titulado && styles.errorValue]}>
            {titulado ? 'Completado' : 'false'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>PENDIENTES</Text>
          <Text style={styles.value}>
            {datoPendiente === null ? 'null' : String(datoPendiente)}
          </Text>
        </View>
      </View>

      <View style={styles.localImageContainer}>
        <Text style={styles.localImageLabel}>IMAGEN FROM LOCAL</Text>

        <View style={styles.neonOrbit}>
          <Image
            source={require('../assets/boulevard.jpg')}
            style={styles.profileImg}
            resizeMode="cover"
          />
        </View>
      </View>
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
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  neonOrbit: {
    padding: 4,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#bf5af2',
    marginBottom: 15,
    overflow: 'hidden',
  },

  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  mainTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  badge: {
    backgroundColor: '#bf5af222',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },

  badgeText: {
    color: '#bf5af2',
    fontSize: 10,
    fontWeight: '800',
  },

  glassCard: {
    width: '100%',
    backgroundColor: '#151525',
    borderRadius: 30,
    padding: 25,
  },

  cardTitle: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 20,
  },

  infoRow: {
    marginBottom: 20,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  statBox: {
    backgroundColor: '#090912',
    padding: 15,
    borderRadius: 20,
    width: '48%',
    alignItems: 'center',
  },

  label: {
    color: '#bf5af2',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 5,
  },

  value: {
    color: '#fff',
    fontSize: 16,
  },

  errorValue: {
    color: '#ff453a',
    fontWeight: '600',
  },

  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  localImageContainer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },

  localImageLabel: {
    color: '#bf5af2',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});