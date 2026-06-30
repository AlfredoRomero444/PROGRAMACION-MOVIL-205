import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = '@asyd_core_theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof darkColors;
  isThemeReady: boolean;
}

const darkColors = {
  // Fondos
  bg:         '#090912',
  bgCard:     '#151525',
  bgDeep:     '#0f0f1e',
  bgInput:    '#151525',
  // Texto
  textPrimary:   '#ffffff',
  textSecondary: '#8e8e93',
  textMuted:     '#5e5e66',
  // Bordes
  border:     '#ffffff10',
  borderMid:  '#ffffff1a',
  // Acento (morado — no cambia)
  accent:        '#bf5af2',
  accentLight:   '#d4a8f5',
  accentFaint:   '#bf5af215',
  accentBorder:  '#bf5af230',
  // Otros
  green:      '#32d74b',
  red:        '#ff453a',
  tabBar:     '#0a0a12',
  tabBorder:  '#bf5af230',
};

const lightColors: typeof darkColors = {
  bg:         '#f2f2f7',
  bgCard:     '#ffffff',
  bgDeep:     '#ffffff',
  bgInput:    '#ffffff',
  textPrimary:   '#000000',
  textSecondary: '#6c6c70',
  textMuted:     '#aeaeb2',
  border:     '#00000010',
  borderMid:  '#0000001a',
  accent:        '#bf5af2',
  accentLight:   '#9b30d9',
  accentFaint:   '#bf5af215',
  accentBorder:  '#bf5af240',
  green:      '#34c759',
  red:        '#ff3b30',
  tabBar:     '#ffffff',
  tabBorder:  '#bf5af230',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  colors: darkColors,
  isThemeReady: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isThemeReady, setIsThemeReady] = useState(false);

  // Carga el tema guardado al iniciar la app
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') {
          setTheme(saved);
        }
      } catch (e) {
        // Si falla la lectura, se queda con el tema por defecto
      } finally {
        setIsThemeReady(true);
      }
    })();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isThemeReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}