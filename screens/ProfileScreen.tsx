import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

// REQUISITO: Declaración explícita de al menos 5 tipos de datos en TypeScript
const nombre: string = "Alfredo G";                             // 1. string
const carrera: string = "Ingeniería en Sistemas Computacionales";    // string (mismo tipo)
const cuatrimestre: number = 10;                                 // 2. number
const promedio: number = 9.5;                                   // number (mismo tipo)
const inscrito: boolean = true;                                 // 3. boolean
const datoPendiente: null = null;                               // 4. null
const valorIndefinido: undefined = undefined;                   // 5. undefined

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* REQUISITO: Renderizado de Imagen desde Internet */}
      <Text style={styles.sectionTitle}>Foto desde Internet (URL)</Text>
      <Image
        source={{ uri: 'https://picsum.photos/150' }}
        style={styles.avatar}
      />

      {/* REQUISITO: Renderizado de Imagen Local */}
      <Text style={styles.sectionTitle}>Foto Local (Assets)</Text>
      <Image
        source={require('../assets/icon.png')} 
        style={styles.avatar}
      />

      {/* REQUISITO: Renderizado e impresión de los tipos de datos en la interfaz */}
      <View style={styles.card}>
        <Text style={styles.label}>Nombre (string):</Text>
        <Text style={styles.value}>{nombre}</Text>

        <Text style={styles.label}>Carrera (string):</Text>
        <Text style={styles.value}>{carrera}</Text>

        <Text style={styles.label}>Cuatrimestre (number):</Text>
        <Text style={styles.value}>{cuatrimestre}°</Text>

        <Text style={styles.label}>Promedio (number):</Text>
        <Text style={styles.value}>{promedio}</Text>

        <Text style={styles.label}>¿Inscrito? (boolean):</Text>
        <Text style={styles.value}>{inscrito ? "Sí, Activo" : "No"}</Text>

        <Text style={styles.label}>Dato Pendiente (null):</Text>
        <Text style={styles.value}>{String(datoPendiente)}</Text>

        <Text style={styles.label}>Valor Indefinido (undefined):</Text>
        <Text style={styles.value}>{String(valorIndefinido)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 4, marginTop: 10 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#3b82f6', marginBottom: 10 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 3, marginTop: 10 },
  label: { fontSize: 11, color: '#3b82f6', fontWeight: 'bold', marginTop: 8 },
  value: { fontSize: 15, color: '#333', marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 2 },
});