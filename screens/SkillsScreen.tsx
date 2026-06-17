import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

// Estructura de datos con URLs 100% estables de Wikimedia e Iconscout
const habilidades = [
  {
    name: 'React Native',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/3840px-React-icon.svg.png'
  },
  {
    name: 'TypeScript',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-typescript-1174965.png'
  },
  {
    name: 'JavaScript',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-javascript-1-225993.png'
  },
  {
    name: 'Git & GitHub',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-github-159-721954.png'
  },
  {
    name: 'HTML & CSS',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-html5-40-1175209.png'
  }
];

export default function SkillsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HABILIDADES</Text>
        <Text style={styles.subtitle}>Tech Stack Recorrido con .map()</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {habilidades.map((skill, index) => (
          <View key={index} style={styles.skillCard}>
            <View style={styles.iconCircle}>
              {/* Renderiza el logo y le mete el color azul oficial si es React Native */}
              <Image 
                source={{ uri: skill.logo }} 
                style={[
                  styles.skillLogo, 
                  skill.name === 'React Native' && { tintColor: '#61dafb' }
                ]} 
                resizeMode="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${85 - (index * 5)}%` }]} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090912', padding: 25 },
  header: { marginBottom: 30 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#bf5af2', fontSize: 12, fontWeight: '600' },
  scroll: { paddingBottom: 20 },
  skillCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#151525', padding: 20, borderRadius: 25,
    borderWidth: 1, borderColor: '#ffffff05', marginBottom: 15
  },
  iconCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#090912',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#bf5af2',
    overflow: 'hidden'
  },
  skillLogo: {
    width: 28,
    height: 28,
  },
  textContainer: { flex: 1, marginLeft: 15 },
  skillName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  progressBg: { height: 4, backgroundColor: '#ffffff11', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#bf5af2', borderRadius: 2 },
});