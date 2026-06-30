import React, { useState, useEffect, useRef } from 'react';
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
import { StatusBar, StyleSheet, View, Animated } from 'react-native';
import { House, Search, Disc3, User, Library } from 'lucide-react-native';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import LoginScreen     from './src/screens/LoginScreen';
import RegisterScreen  from './src/screens/RegisterScreen';
import HomeScreen      from './src/screens/HomeScreen';
import ExploreStack    from './src/navigation/ExploreStack';
import StoreScreen     from './src/screens/StoreScreen';
import ColeccionScreen from './src/screens/ColeccionScreen';
import ProfileScreen   from './src/screens/ProfileScreen';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

type TabParamList = {
  Inicio: undefined;
  Explorar: undefined;
  Tienda: undefined;
  Colección: undefined;
  Perfil: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

// ── Pantalla de carga post-login ──────────────────────────────────────────────
function LoadingScreen({ bgColor }: { bgColor: string }) {
  const dot   = useRef(new Animated.Value(0)).current;
  const star  = useRef(new Animated.Value(0)).current;
  const spark = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1,   duration: 600, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    pulse(dot, 0); pulse(star, 200); pulse(spark, 400);
  }, []);

  const mk = (anim: Animated.Value, outScale: number) => ({
    opacity: anim,
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, outScale] }) }],
  });

  return (
    <View style={[loadingStyles.container, { backgroundColor: bgColor }]}>
      <View style={loadingStyles.row}>
        <Animated.Text style={[loadingStyles.symbol, mk(dot,   1.2)]}>.</Animated.Text>
        <Animated.Text style={[loadingStyles.symbol, mk(star,  1.4)]}>✧</Animated.Text>
        <Animated.Text style={[loadingStyles.symbol, mk(spark, 1.3)]}>⋆</Animated.Text>
      </View>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  symbol:    { color: '#bf5af2', fontSize: 48, fontWeight: '300' },
});

// ── Tabs (usa colores del tema) ───────────────────────────────────────────────
function MainTabs({ onLogout }: { onLogout: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle:         { backgroundColor: colors.tabBar },
        headerTintColor:     colors.textPrimary,
        headerShadowVisible: false,
        headerTitleStyle:    { fontWeight: '700', fontSize: 18, color: colors.textPrimary },
        tabBarActiveTintColor:   colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 1.5,
          borderTopColor: colors.tabBorder,
          height: 60 + insets.bottom,
          paddingTop: 4,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 3,
          marginTop: -2,
        },
        tabBarIcon: ({ focused, color }) => (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            {route.name === 'Inicio'    && <House   color={color} size={18} strokeWidth={2} />}
            {route.name === 'Explorar'  && <Search  color={color} size={18} strokeWidth={2} />}
            {route.name === 'Tienda'    && <Disc3   color={color} size={18} strokeWidth={2} />}
            {route.name === 'Colección' && <Library color={color} size={18} strokeWidth={2} />}
            {route.name === 'Perfil'    && <User    color={color} size={18} strokeWidth={2} />}
          </View>
        ),
      })}
    >
      <Tab.Screen name="Inicio"    component={HomeScreen} />
      <Tab.Screen name="Explorar"  component={ExploreStack} options={{ headerShown: false }} />
      <Tab.Screen name="Tienda"    component={StoreScreen} />
      <Tab.Screen name="Colección" component={ColeccionScreen} />
      <Tab.Screen name="Perfil">
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ── Root interno (necesita acceso al contexto) ────────────────────────────────
function AppInner() {
  const { theme, colors, isThemeReady } = useTheme();
  const [isLogged, setIsLogged] = useState(false);
  const [isReady,  setIsReady]  = useState(false);

  const handleLogin = () => {
    setIsLogged(true);
    setIsReady(false);
    setTimeout(() => setIsReady(true), 800);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setIsReady(false);
  };

  // Espera a que el tema guardado se cargue antes de renderizar nada,
  // para evitar el "flash" del tema incorrecto al abrir la app.
  if (!isThemeReady) {
    return <LoadingScreen bgColor={colors.bg} />;
  }

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      {isLogged && !isReady && <LoadingScreen bgColor={colors.bg} />}

      <View style={{ flex: 1, display: (!isLogged || isReady) ? 'flex' : 'none' }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLogged ? (
              <>
                <Stack.Screen name="Login">
                  {(props: LoginScreenProps) => (
                    <LoginScreen {...props} onLogin={handleLogin} />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            ) : (
              <Stack.Screen name="MainTabs">
                {() => <MainTabs onLogout={handleLogout} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
});