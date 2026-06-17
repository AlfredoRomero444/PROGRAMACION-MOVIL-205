import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

// Estructura de datos
const habilidades = [
  {
    name: 'React Native',
   logo: require('../../assets/logoreact.jpg'),
  },
  {
    name: 'TypeScript',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-typescript-1174965.png',
  },
  {
    name: 'JavaScript',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-javascript-1-225993.png',
  },
  {
    name: 'Git & GitHub',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-github-159-721954.png',
  },
  {
    name: 'HTML & CSS',
    logo: 'https://cdn.iconscout.com/icon/free/png-512/free-html5-40-1175209.png',
  },
];

export default function SkillsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HABILIDADES</Text>

        <Text style={styles.subtitle}>
          Tech Stack Recorrido con .map()
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {habilidades.map((skill, index) => (
          <View key={index} style={styles.skillCard}>
            <View style={styles.iconCircle}>
              <Image
                source={
                  typeof skill.logo === 'string'
                    ? { uri: skill.logo }
                    : skill.logo
                }
                style={styles.skillLogo}
                resizeMode="cover"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.skillName}>{skill.name}</Text>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${85 - index * 5}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
    padding: 25,
  },

  header: {
    marginBottom: 30,
  },

  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },

  subtitle: {
    color: '#bf5af2',
    fontSize: 12,
    fontWeight: '600',
  },

  scroll: {
    paddingBottom: 20,
  },

  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151525',
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ffffff05',
    marginBottom: 15,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#bf5af2',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090912',
  },

  skillLogo: {
    width: '100%',
    height: '100%',
  },

  textContainer: {
    flex: 1,
    marginLeft: 15,
  },

  skillName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  progressBg: {
    height: 4,
    backgroundColor: '#ffffff11',
    borderRadius: 2,
  },

  progressFill: {
    height: 4,
    backgroundColor: '#bf5af2',
    borderRadius: 2,
  },
});