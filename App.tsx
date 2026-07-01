import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View, Animated } from 'react-native';

import { ThemeProvider, useTheme }  from './src/context/ThemeContext';
import { AuthProvider, useAuth }    from './src/context/AuthContext';
import { CartProvider, useCart }    from './src/context/CartContext';
import { FacturasProvider }         from './src/context/FacturasContext';
import { NavBarVisibilityProvider, useNavBarVisibility } from './src/context/NavBarVisibilityContext';
import SplashScreen        from './src/components/SplashScreen';
import LogoutScreen        from './src/components/Logoutscreen';
import ReturnToLoginScreen from './src/components/ReturnToLoginScreen';
import SideMenu             from './src/components/SideMenu';
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
// Ya no hay hamburguesa ni menú desplegable: la barra de navegación (SideMenu)
// es fija y siempre visible, así ningún ícono queda encima de los títulos de
// cada pantalla y el layout es totalmente predecible.
function MainTabs({ onLogout }: { onLogout: () => void }) {
  const { colors } = useTheme();
  const { totalItems } = useCart();
  const { navBarHidden } = useNavBarVisibility();
  const insets = useSafeAreaInsets();
  const navigationRef = useRef<any>(null);
  // Fuerza un re-render del SideMenu (barra fija) cada vez que cambia
  // la pestaña activa, para que resalte el ícono correcto. Se hace con
  // un listener (no dentro del render de Tab.Navigator) para evitar el
  // error de "setState durante el render de otro componente".
  const [, setActiveTabTick] = useState(0);

  useEffect(() => {
    const nav = navigationRef.current;
    if (!nav?.addListener) return;
    const unsubscribe = nav.addListener('state', () => {
      setActiveTabTick((n) => n + 1);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => {
            // No se dibuja la barra por defecto: solo capturamos el objeto
            // navigation para que el SideMenu (fuera del Tab.Navigator)
            // pueda navegar entre pestañas y saber cuál está activa.
            navigationRef.current = props.navigation;
            return null;
          }}
        >
          <Tab.Screen name="Inicio"    component={HomeScreen} />
          <Tab.Screen name="Explorar"  component={ExploreStack} />
          <Tab.Screen name="Colección" component={ColeccionScreen} />
          <Tab.Screen name="Tienda"    component={StoreStack} />
          <Tab.Screen name="Carrito"   component={CartScreen} />
          <Tab.Screen name="Facturas"  component={FacturasScreen} />
          <Tab.Screen name="Perfil">
            {() => <ProfileScreen onLogout={onLogout} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>

      {!navBarHidden && (
        <SideMenu
          navigationRef={navigationRef}
          colors={colors}
          totalItems={totalItems}
        />
      )}
    </View>
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
              <NavBarVisibilityProvider>
                <SplashScreen>
                  <AppInner />
                </SplashScreen>
              </NavBarVisibilityProvider>
            </FacturasProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

