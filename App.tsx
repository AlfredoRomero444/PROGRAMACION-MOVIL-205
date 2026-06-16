import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  User,
  Zap,
  Laptop,
  Disc3,
} from 'lucide-react-native';

import ProfileScreen from './src/screens/ProfileScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import ProjectScreen from './src/screens/ProjectScreen';
import HomeScreen from './src/screens/HomeScreen'

const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const iconColor = focused
            ? '#bf5af2'
            : '#8e8e93';

          const iconOpacity = focused
            ? 1
            : 0.5;

          return (
            <View
              style={[
                styles.iconWrapper,
                focused &&
                  styles.iconWrapperActive,
              ]}
            >
              <View
                style={{
                  opacity: iconOpacity,
                }}
              >
                {route.name === 'Perfil' && (
                  <User
                    color={iconColor}
                    size={18}
                    strokeWidth={2}
                  />
                )}

                {route.name === 'Habilidades' && (
                  <Zap
                    color={iconColor}
                    size={18}
                    strokeWidth={2}
                  />
                )}

                {route.name ===
                  'Mi Proyecto' && (
                  <Laptop
                    color={iconColor}
                    size={18}
                    strokeWidth={2}
                  />
                )}

                {route.name ===
                  'Tienda' && (
                  <Disc3
                    color={iconColor}
                    size={18}
                    strokeWidth={2}
                  />
                )}
              </View>
            </View>
          );
        },

        tabBarActiveTintColor:
          '#bf5af2',

        tabBarInactiveTintColor:
          '#8e8e93',

        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 3,
          marginTop: -2,
        },

        tabBarStyle: {
          backgroundColor: '#0a0a12',
          borderTopWidth: 1.5,
          borderTopColor:
            '#bf5af230',

          height: 60 + insets.bottom,
          paddingTop: 4,
          paddingBottom: Math.max(
            insets.bottom,
            8
          ),
        },

        headerStyle: {
          backgroundColor: '#0a0a12',
        },

        headerTintColor: '#fff',

        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
      />

      <Tab.Screen
        name="Habilidades"
        component={SkillsScreen}
      />

      <Tab.Screen
        name="Mi Proyecto"
        component={ProjectScreen}
      />

      <Tab.Screen
        name="Tienda"
        component={HomeScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0a0a12"
        translucent={false}
      />

      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </SafeAreaProvider>
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
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    backgroundColor: '#bf5af215',
  },
});