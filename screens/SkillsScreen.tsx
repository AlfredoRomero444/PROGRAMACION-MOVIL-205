import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// REQUISITO: Creación de un arreglo (Colección de datos)
const habilidades: string[] = ['React Native', 'TypeScript', 'JavaScript', 'Git & GitHub', 'HTML & CSS'];

export default function SkillsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Habilidades</Text>
      <Text style={styles.subtitulo}>Colecciones recorridas dinámicamente</Text>

      {/* REQUISITO: Manipulación y recorrido de la colección usando el método .map() */}
      <View style={styles.skillsContainer}>
        {habilidades.map((habilidad, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>⚡ {habilidad}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1a202c', marginBottom: 4 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 30 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  chip: { backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, elevation: 3 },
  chipText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});