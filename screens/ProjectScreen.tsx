import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// REQUISITO: Estructura de un objeto complejo completo
const proyecto = {
  nombre: "Portafolio Móvil",
  version: "1.0.0",
  descripcion: "Aplicación desarrollada en React Native para la evaluación del primer parcial.",
  repositorio: "github.com/AlfredoRomero444/PROGRAMACION-MOVIL-205", // Tu repositorio
  activo: true,
};

export default function ProjectScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Mi Proyecto Integrador</Text>

      {/* REQUISITO: Renderizado del objeto campo por campo */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Campos del Objeto Mapeados</Text>
        
        <Text style={styles.label}>Nombre del Proyecto:</Text>
        <Text style={styles.value}>{proyecto.nombre}</Text>

        <Text style={styles.label}>Versión:</Text>
        <Text style={styles.value}>v{proyecto.version}</Text>

        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value}>{proyecto.descripcion}</Text>

        <Text style={styles.label}>Repositorio GitHub:</Text>
        <Text style={styles.repoValue}>{proyecto.repositorio}</Text>

        <Text style={styles.label}>Estado del Proyecto:</Text>
        <Text style={styles.status}>{proyecto.activo ? "🟢 Activo / Despliegue Web" : "🔴 Inactivo"}</Text>
      </View>

      {/* REQUISITO: Impresión cruda de la estructura del objeto usando JSON.stringify */}
      <Text style={styles.sectionHeader}>Impresión Cruda (JSON.stringify)</Text>
      <View style={styles.codeContainer}>
        <Text style={styles.codeText}>
          {JSON.stringify(proyecto, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1a202c', marginBottom: 20, textAlign: 'center' },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 10, textTransform: 'uppercase' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 3 },
  label: { fontSize: 11, color: '#718096', fontWeight: 'bold', marginTop: 8 },
  value: { fontSize: 15, color: '#2d3748' },
  repoValue: { fontSize: 14, color: '#3b82f6', textDecorationLine: 'underline' },
  status: { fontSize: 14, fontWeight: 'bold', marginTop: 2, color: '#2f855a' },
  codeContainer: { backgroundColor: '#1e1e1e', borderRadius: 8, padding: 15 },
  codeText: { color: '#4af626', fontFamily: 'monospace', fontSize: 13 },
});