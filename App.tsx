import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image, View } from 'react-native';

import ProfileScreen from './screens/ProfileScreen';
import SkillsScreen from './screens/SkillsScreen';
import ProjectScreen from './screens/ProjectScreen';

const Tab = createBottomTabNavigator();

// Enlaces estables corregidos a iconos vectoriales en formato PNG
const tabIcons = {
  Perfil: {
    default: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png', // Usuario lineal
    focused: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png', 
  },
  Habilidades: {
    default: 'https://cdn-icons-png.flaticon.com/512/9351/9351717.png', // Rayo con pulso eléctrico
    focused: 'https://cdn-icons-png.flaticon.com/512/9351/9351717.png',
  },
  'Mi Proyecto': {
    default: 'https://cdn-icons-png.flaticon.com/512/4213/4213179.png', // Laptop lineal corregida
    focused: 'https://cdn-icons-png.flaticon.com/512/4213/4213179.png',
  }
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const iconUrl = focused 
              ? tabIcons[route.name as keyof typeof tabIcons].focused 
              : tabIcons[route.name as keyof typeof tabIcons].default;

            return (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <Image 
                  source={{ uri: iconUrl }} 
                  style={[
                    styles.imageIcon, 
                    focused ? styles.imageIconActive : styles.imageIconInactive
                  ]}
                  resizeMode="contain"
                />
              </View>
            );
          },
          tabBarActiveTintColor: '#bf5af2', // Púrpura neón
          tabBarInactiveTintColor: '#8e8e93', // Gris
          tabBarStyle: { 
            backgroundColor: '#0a0a12', 
            borderTopWidth: 1,
            borderTopColor: '#ffffff10',
            height: 75,
            paddingBottom: 12,
            paddingTop: 10
          },
          headerStyle: { backgroundColor: '#0a0a12' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', letterSpacing: 1 },
        })}
      >
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        <Tab.Screen name="Habilidades" component={SkillsScreen} />
        <Tab.Screen name="Mi Proyecto" component={ProjectScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center', // Sintaxis correcta de React Native / TypeScript
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconWrapperActive: {
    shadowColor: '#bf5af2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: '#bf5af212',
  },
  imageIcon: {
    width: 26,
    height: 26,
  },
  imageIconActive: {
    tintColor: '#bf5af2', 
  },
  imageIconInactive: {
    tintColor: '#8e8e93', 
    opacity: 0.5
  }
});