import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image, View } from 'react-native';

import ProfileScreen from './screens/ProfileScreen';
import SkillsScreen from './screens/SkillsScreen';
import ProjectScreen from './screens/ProjectScreen';

const Tab = createBottomTabNavigator();

// Enlaces estables a iconos vectoriales en formato PNG de alta calidad y fondo transparente
const tabIcons = {
  Perfil: {
    default: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png', // Usuario lineal
    focused: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png', // Usuario relleno
  },
  Habilidades: {
    default: 'https://cdn-icons-png.flaticon.com/512/9357/9357004.png', // Átomo / Ciencia lineal
    focused: 'https://cdn-icons-png.flaticon.com/512/9356/9356956.png', // Átomo / Ciencia relleno
  },
  'Mi Proyecto': {
    default: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png', // Código / Computador lineal
    focused: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png', // Código / Computador relleno
  }
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            // Seleccionamos la URL adecuada basándonos en si la pestaña está activa o no
            const iconUrl = focused 
              ? tabIcons[route.name as keyof typeof tabIcons].focused 
              : tabIcons[route.name as keyof typeof tabIcons].default;

            return (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <Image 
                  source={{ uri: iconUrl }} 
                  style={[styles.imageIcon, focused ? styles.imageIconActive : styles.imageIconInactive]}
                  resizeMode="contain"
                />
              </View>
            );
          },
          tabBarActiveTintColor: '#bf5af2', // Púrpura neón oficial
          tabBarInactiveTintColor: '#8e8e93',
          tabBarStyle: { 
            backgroundColor: '#0a0a12', 
            borderTopWidth: 1,
            borderTopColor: '#ffffff10',
            height: 70,
            paddingBottom: 12,
            paddingTop: 8
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
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // Contenedor con efecto de resplandor neón exterior exclusivo para el activo
  iconWrapperActive: {
    shadowColor: '#bf5af2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    backgroundColor: '#bf5af208'
  },
  imageIcon: {
    width: 22,
    height: 22,
  },
  // Tinte púrpura brillante para el ícono seleccionado
  imageIconActive: {
    tintColor: '#bf5af2',
  },
  // Tinte grisáceo tenue para mantener baja opacidad de fondo
  imageIconInactive: {
    tintColor: '#8e8e93',
    opacity: 0.6
  }
});