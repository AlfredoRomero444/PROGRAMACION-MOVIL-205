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
import { House, Search, Disc3, User, Library, ShoppingCart, Receipt } from 'lucide-react-native';

import { ThemeProvider, useTheme }  from './src/context/ThemeContext';
import { AuthProvider, useAuth }    from './src/context/AuthContext';
import { CartProvider, useCart }    from './src/context/CartContext';
import { FacturasProvider }         from './src/context/FacturasContext';
import SplashScreen        from './src/components/SplashScreen';
import LogoutScreen        from './src/components/Logoutscreen';
import ReturnToLoginScreen from './src/components/ReturnToLoginScreen';
import LoginScreen         from './src/screens/LoginScreen';
import RegisterScreen  from './src/screens/RegisterScreen';
import HomeScreen      from './src/screens/HomeScreen';
import ExploreStack    from './src/navigation/ExploreStack';
import StoreStack      from './src/navigation/StoreStack';
import CartScreen      from './src/screens/CartScreen';
import FacturasScreen  from './src/screens/FacturasScreen';
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
  Carrito: undefined;
  Facturas: undefined;
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
  symbol:    { color: '#fec3b1', fontSize: 48, fontWeight: '300' },
});

// ── Tabs (usa colores del tema) ───────────────────────────────────────────────
function MainTabs({ onLogout }: { onLogout: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();
  const { totalItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle:         { backgroundColor: colors.tabBar },
        headerTintColor:     colors.textPrimary,
        headerShadowVisible: false,
        headerTitleStyle:    { fontWeight: '700', fontSize: 18, color: colors.textPrimary },
        tabBarActiveTintColor:   colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarBadgeStyle: {
          backgroundColor: colors.accent,
          color: '#fff',
          fontSize: 10,
          fontWeight: '700',
        },
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
            {route.name === 'Inicio'    && <House       color={color} size={18} strokeWidth={2} />}
            {route.name === 'Explorar'  && <Search      color={color} size={18} strokeWidth={2} />}
            {route.name === 'Tienda'    && <Disc3       color={color} size={18} strokeWidth={2} />}
            {route.name === 'Carrito'   && <ShoppingCart color={color} size={18} strokeWidth={2} />}
            {route.name === 'Facturas'  && <Receipt     color={color} size={18} strokeWidth={2} />}
            {route.name === 'Colección' && <Library     color={color} size={18} strokeWidth={2} />}
            {route.name === 'Perfil'    && <User        color={color} size={18} strokeWidth={2} />}
          </View>
        ),
      })}
    >
      <Tab.Screen name="Inicio"    component={HomeScreen} />
      <Tab.Screen name="Explorar"  component={ExploreStack} options={{ headerShown: false }} />
      <Tab.Screen name="Tienda"    component={StoreStack} options={{ headerShown: false }} />
      <Tab.Screen
        name="Carrito"
        component={CartScreen}
        options={{ tabBarBadge: totalItems > 0 ? totalItems : undefined }}
      />
      <Tab.Screen name="Facturas"  component={FacturasScreen} />
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
  const { isLogged, isAuthReady, login, logout } = useAuth();
  const [isReady,      setIsReady]      = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isReturning,  setIsReturning]  = useState(false);

  // Si ya había una sesión guardada al abrir la app, no repetimos la
  // animación de "cargando" — el usuario ya estaba dentro.
  useEffect(() => {
    if (isAuthReady && isLogged) setIsReady(true);
  }, [isAuthReady, isLogged]);

  const handleLogin = (correo?: string) => {
    login({ nombre: correo ? correo.split('@')[0] : 'Usuario', correo: correo ?? '' });
    setIsReady(false);
    setTimeout(() => setIsReady(true), 800);
  };

  const handleLogout = () => {
    // Etapa 1: "Saliendo…" con spinner grande y texto.
    setIsLoggingOut(true);

    setTimeout(() => {
      setIsLoggingOut(false);
      // Etapa 2: transición más sutil (solo spinner chico),
      // igual que hace Facebook justo antes de mostrar el Login.
      setIsReturning(true);

      setTimeout(() => {
        logout();
        setIsReady(false);
        setIsReturning(false);
      }, 2200);
    }, 900);
  };

  // Espera a que el tema y la sesión guardada terminen de cargar antes
  // de renderizar nada, para evitar el "flash" del login incorrecto.
  if (!isThemeReady || !isAuthReady) {
    return <LoadingScreen bgColor={colors.bg} />;
  }

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      {isLogged && !isReady && <LoadingScreen bgColor={colors.bg} />}

      {isLoggingOut && <LogoutScreen />}
      {isReturning  && <ReturnToLoginScreen />}

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
        <AuthProvider>
          <CartProvider>
            <FacturasProvider>
              <SplashScreen>
                <AppInner />
              </SplashScreen>
            </FacturasProvider>
          </CartProvider>
        </AuthProvider>
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
    backgroundColor: '#fec3b115',
    shadowColor: '#fec3b1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
});