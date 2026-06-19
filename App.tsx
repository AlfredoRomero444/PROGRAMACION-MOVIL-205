import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  House,
  Search,
  Disc3,
  User,
} from 'lucide-react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import StoreScreen from './src/screens/StoreScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

type TabParamList = {
  Inicio: undefined;
  Explorar: undefined;
  Tienda: undefined;
  Perfil: undefined;
};

type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const Tab =
  createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#0a0a12',
        },

        headerTintColor: '#fff',

        headerShadowVisible: false,

        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },

        tabBarActiveTintColor: '#bf5af2',

        tabBarInactiveTintColor: '#8e8e93',

        tabBarStyle: {
          backgroundColor: '#0a0a12',
          borderTopWidth: 1.5,
          borderTopColor: '#bf5af230',
          height: 60 + insets.bottom,
          paddingTop: 4,
          paddingBottom: Math.max(
            insets.bottom,
            8
          ),
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 3,
          marginTop: -2,
        },

        tabBarIcon: ({ focused, color }) => (
          <View
            style={[
              styles.iconWrapper,
              focused &&
                styles.iconWrapperActive,
            ]}
          >
            {route.name === 'Inicio' && (
              <House
                color={color}
                size={18}
                strokeWidth={2}
              />
            )}

            {route.name === 'Explorar' && (
              <Search
                color={color}
                size={18}
                strokeWidth={2}
              />
            )}

            {route.name === 'Tienda' && (
              <Disc3
                color={color}
                size={18}
                strokeWidth={2}
              />
            )}

            {route.name === 'Perfil' && (
              <User
                color={color}
                size={18}
                strokeWidth={2}
              />
            )}
          </View>
        ),
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Explorar"
        component={ExploreScreen}
      />

      <Tab.Screen
        name="Tienda"
        component={StoreScreen}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLogged, setIsLogged] =
    useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0a0a12"
      />

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isLogged ? (
            <>
              <Stack.Screen name="Login">
                {(
                  props: LoginScreenProps
                ) => (
                  <LoginScreen
                    {...props}
                    onLogin={() =>
                      setIsLogged(true)
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen
                name="Register"
                component={RegisterScreen}
              />
            </>
          ) : (
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
            />
          )}
        </Stack.Navigator>
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
    backgroundColor: '#bf5af215',

    shadowColor: '#bf5af2',

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.9,

    shadowRadius: 8,
  },
});