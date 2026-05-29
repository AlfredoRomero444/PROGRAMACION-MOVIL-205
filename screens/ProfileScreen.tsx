import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const nombre: string = "Alfredo G"; 
const carrera: string = "Ingeniería en Sistemas Computacionales";
const cuatrimestre: number = 10; 
const promedio: number = 9.5;
const titulado: boolean = false; 
const datoPendiente: null = null; 

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.neonOrbit}>
          <Image source={{ uri: 'https://images.genius.com/f3d1d78ded7a82fe8bc7ec6441eb9018.1000x996x1.jpg' }} style={styles.profileImg} />
        </View>
        <Text style={styles.mainTitle}>{nombre}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>ESTUDIANTE</Text></View>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>DATOS DEL PERFIL</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>CARRERA</Text>
          <Text style={styles.value}>{carrera}</Text>
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
          <Text style={styles.label}>ESTADO TITULACIÓN (boolean)</Text>
          {/* Si es falso, se aplica el estilo rojo personalizado */}
          <Text style={[styles.value, !titulado && styles.errorValue]}>
            {titulado ? "Completado" : "false"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>PENDIENTES (null)</Text>
          {/* Se fuerza el renderizado exacto de la cadena "null" */}
          <Text style={styles.value}>
            {datoPendiente === null ? "null" : String(datoPendiente)}
          </Text>
        </View>
      </View>

      <View style={styles.localImageContainer}>
         <Text style={styles.label}>LOGO LOCAL (ASSETS)</Text>
         <Image source={require('../assets/icon.png')} style={styles.localImg} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090912' },
  content: { padding: 25, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  neonOrbit: {
    padding: 4, borderRadius: 100,
    borderWidth: 2, borderColor: '#bf5af2',
    shadowColor: '#bf5af2', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 15, marginBottom: 15
  },
  profileImg: { width: 120, height: 120, borderRadius: 60 },
  mainTitle: { fontSize: 28, color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  badge: { backgroundColor: '#bf5af222', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 8, borderWidth: 1, borderColor: '#bf5af2' },
  badgeText: { color: '#bf5af2', fontSize: 10, fontWeight: '800' },
  glassCard: {
    width: '100%', backgroundColor: '#151525', borderRadius: 30, padding: 25,
    borderWidth: 1, borderColor: '#ffffff15',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20
  },
  cardTitle: { color: '#8e8e93', fontSize: 12, fontWeight: '800', marginBottom: 20, letterSpacing: 2 },
  infoRow: { marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { backgroundColor: '#090912', padding: 15, borderRadius: 20, width: '48%', alignItems: 'center', borderWidth: 1, borderColor: '#bf5af233' },
  label: { color: '#bf5af2', fontSize: 10, fontWeight: '700', marginBottom: 5 },
  value: { color: '#fff', fontSize: 16 },
  // Estilo específico en color rojo neón para resaltar el valor falso
  errorValue: { color: '#ff453a', fontWeight: '600' },
  statValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  localImageContainer: { marginTop: 30, alignItems: 'center' },
  localImg: { width: 60, height: 60, opacity: 0.7 },
});