import React, { createContext, useContext, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof darkColors;
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
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}