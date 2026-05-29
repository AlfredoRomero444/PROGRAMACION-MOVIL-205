import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

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
            let icon;
            if (route.name === 'Perfil') icon = '👤';
            else if (route.name === 'Habilidades') icon = '⚡';
            else if (route.name === 'Mi Proyecto') icon = '💻';
            
            return (
              <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {icon}
              </Text>
            );
          },
          tabBarActiveTintColor: '#bf5af2', // Púrpura neón
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
  tabIcon: {
    fontSize: 20,
    opacity: 0.6
  },
  tabIconActive: {
    opacity: 1,
    textShadowColor: '#bf5af2',
    textShadowRadius: 6
  }
});