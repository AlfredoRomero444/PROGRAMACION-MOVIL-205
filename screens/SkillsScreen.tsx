import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const habilidades: string[] = ['React Native', 'TypeScript', 'JavaScript', 'Git & GitHub', 'HTML & CSS'];

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
              <Text style={styles.iconText}>⚡</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.skillName}>{skill}</Text>
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
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#bf5af2'
  },
  iconText: { fontSize: 20 },
  textContainer: { flex: 1, marginLeft: 15 },
  skillName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  progressBg: { height: 4, backgroundColor: '#ffffff11', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#bf5af2', borderRadius: 2 },
});