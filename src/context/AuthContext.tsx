import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sesión de usuario persistida en el dispositivo.
 *
 * Antes, el estado de "logueado" vivía solo en memoria (useState en App.tsx),
 * así que cada vez que se cerraba la app el usuario tenía que volver a
 * iniciar sesión — eso no es el comportamiento de una app profesional.
 * Este contexto guarda la sesión en AsyncStorage, igual que ya se hace
 * con el tema (ver ThemeContext), y expone login()/logout() reales.
 */

const SESSION_STORAGE_KEY = '@asyd_core_session';

export interface SessionUser {
  nombre: string;
  correo: string;
}

interface AuthContextType {
  isLogged: boolean;
  isAuthReady: boolean;
  user: SessionUser | null;
  login: (user: SessionUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isAuthReady: false,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  // Al iniciar la app, revisa si ya había una sesión guardada.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          const parsed: SessionUser = JSON.parse(saved);
          setUser(parsed);
          setIsLogged(true);
        }
      } catch (e) {
        // Si falla la lectura, se queda como "no logueado".
      } finally {
        setIsAuthReady(true);
      }
    })();
  }, []);

  const login = async (nextUser: SessionUser) => {
    setUser(nextUser);
    setIsLogged(true);
    try {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser));
    } catch (e) {
      // La sesión sigue activa en memoria aunque falle el guardado.
    }
  };

  const logout = async () => {
    setIsLogged(false);
    setUser(null);
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      // No hay nada crítico que hacer si falla el borrado en disco.
    }
  };

  return (
    <AuthContext.Provider value={{ isLogged, isAuthReady, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
