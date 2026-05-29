import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
// Importamos los iconos exactos de Lucide
import { User, Zap, Laptop } from 'lucide-react-native';

import ProfileScreen from './screens/ProfileScreen';
import SkillsScreen from './screens/SkillsScreen';
import ProjectScreen from './screens/ProjectScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            // Configuración de colores según el estado de la pestaña
            const iconColor = focused ? '#bf5af2' : '#8e8e93';
            const iconOpacity = focused ? 1 : 0.5;

            return (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <View style={{ opacity: iconOpacity }}>
                  {route.name === 'Perfil' && (
                    <User color={iconColor} size={24} strokeWidth={2} />
                  )}
                  {route.name === 'Habilidades' && (
                    <Zap color={iconColor} size={24} strokeWidth={2} />
                  )}
                  {route.name === 'Mi Proyecto' && (
                    <Laptop color={iconColor} size={24} strokeWidth={2} />
                  )}
                </View>
              </View>
            );
          },
          tabBarActiveTintColor: '#bf5af2', // Púrpura neón
          tabBarInactiveTintColor: '#8e8e93', // Gris apagado
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
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  // Resplandor neón idéntico para la pestaña activa
  iconWrapperActive: {
    shadowColor: '#bf5af2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: '#bf5af212',
  }
});