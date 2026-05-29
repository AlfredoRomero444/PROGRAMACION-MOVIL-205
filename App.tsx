import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
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
            const iconColor = focused ? '#bf5af2' : '#8e8e93';
            const iconOpacity = focused ? 1 : 0.5;

            return (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <View style={{ opacity: iconOpacity }}>
                  {route.name === 'Perfil' && (
                    <User color={iconColor} size={18} strokeWidth={2} />
                  )}
                  {route.name === 'Habilidades' && (
                    <Zap color={iconColor} size={18} strokeWidth={2} />
                  )}
                  {route.name === 'Mi Proyecto' && (
                    <Laptop color={iconColor} size={18} strokeWidth={2} />
                  )}
                </View>
              </View>
            );
          },
          tabBarActiveTintColor: '#bf5af2',
          tabBarInactiveTintColor: '#8e8e93',
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 3,
            marginTop: -2, // Sube un poco el texto para pegarlo al icono
          },
          tabBarStyle: { 
            backgroundColor: '#0a0a12', 
            borderTopWidth: 1.5,
            borderTopColor: '#bf5af230', // Línea morada superior
            height: 50, // <-- Súper delgada (Estaba en 60)
            paddingTop: 4,
            paddingBottom: 2,
          },
          headerStyle: { backgroundColor: '#0a0a12' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
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
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  iconWrapperActive: {
    shadowColor: '#bf5af2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    backgroundColor: '#bf5af215',
  }
});