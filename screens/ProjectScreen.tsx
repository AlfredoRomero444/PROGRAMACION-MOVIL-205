import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native'; // Importamos Linking

const proyecto = {
  nombre: "Programación Móvil",
  version: "1.0.0",
  descripcion: "Aplicación funcional en React Native parcial I.",

  repositorio: "https://github.com/AlfredoRomero444/PROGRAMACION-MOVIL-205",
  activo: true,
};

export default function ProjectScreen() {
  
  const abrirLink = () => {
    Linking.openURL(proyecto.repositorio).catch((err) => 
      console.error("No se pudo abrir el enlace:", err)
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionLabel}>DETALLES DEL PROYECTO</Text>
      
      <View style={styles.mainCard}>
        <View style={styles.neonLine} />
        <Text style={styles.projectTitle}>{proyecto.nombre}</Text>
        <Text style={styles.description}>{proyecto.descripcion}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
           <Text style={styles.label}>VERSION</Text>
           <Text style={styles.value}>{proyecto.version}</Text>
        </View>

        <View style={styles.row}>
           <Text style={styles.label}>STATUS</Text>
           <Text style={[styles.value, {color: '#32d74b'}]}>{proyecto.activo ? "ACTIVO" : "OFFLINE"}</Text>
        </View>

        <View style={styles.row}>
           <Text style={styles.label}>REPOSITORIO</Text>
           {/* Agregamos el onPress para capturar el clic y activar la función */}
           <Text style={styles.link} onPress={abrirLink}>
              {proyecto.repositorio.replace("https://", "")} {/* Esto quita el https:// visualmente para que se vea limpio en tu pantalla */}
           </Text>
        </View>
      </View>

      <Text style={[styles.sectionLabel, {marginTop: 30}]}>DEBUG DATA (JSON.stringify)</Text>
      
      <View style={styles.consoleBox}>
        <View style={styles.consoleHeader}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.codeText}>
          {JSON.stringify(proyecto, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090912' },
  content: { padding: 25 },
  sectionLabel: { color: '#bf5af2', fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 15 },
  mainCard: { backgroundColor: '#151525', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: '#ffffff10' },
  neonLine: { width: 40, height: 4, backgroundColor: '#bf5af2', borderRadius: 2, marginBottom: 15 },
  projectTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  description: { color: '#8e8e93', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#ffffff10', marginVertical: 15 },
  row: { marginBottom: 15 },
  label: { color: '#8e8e93', fontSize: 10, fontWeight: '700', marginBottom: 4 },
  value: { color: '#fff', fontSize: 15 },
  // Agregamos cursor: 'pointer' para que al pasar el mouse en web aparezca la manita de clic
  link: { color: '#0a84ff', fontSize: 13, textDecorationLine: 'underline', cursor: 'pointer' }, 
  consoleBox: { 
    backgroundColor: '#000', 
    borderRadius: 20, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#bf5af244',
    width: '100%'
  },
  consoleHeader: { flexDirection: 'row', backgroundColor: '#1c1c1e', padding: 10, gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ffffff22' },
  codeText: { 
    color: '#bf5af2', 
    fontFamily: 'monospace', 
    padding: 20, 
    fontSize: 12,
    lineHeight: 18,
    // @ts-ignore
    whiteSpace: 'pre-wrap'
  },
});