import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ExploreScreen from '../screens/ExploreScreen';
import ExploreDetailScreen from '../screens/ExploreDetailScreen';
import ArtistaScreen from '../screens/ArtistaScreen';
import { Disco, Artista } from '../types';
import { useTheme } from '../context/ThemeContext';

// ── Tipos tipados del Stack ──────────────────────────────────────
export type ExploreStackParamList = {
  ExploreList: undefined;
  ExploreDetail: {
    disco: Disco;
    artista: Artista | undefined;
  };
  Artista: undefined;
};

export type ExploreListProps   = NativeStackScreenProps<ExploreStackParamList, 'ExploreList'>;
export type ExploreDetailProps = NativeStackScreenProps<ExploreStackParamList, 'ExploreDetail'>;
export type ArtistaScreenProps = NativeStackScreenProps<ExploreStackParamList, 'Artista'>;

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export default function ExploreStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:       { backgroundColor: colors.bg },
        headerTintColor:   colors.accent,
        headerTitleStyle:  { color: colors.textPrimary, fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        contentStyle:      { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen
        name="ExploreList"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExploreDetail"
        component={ExploreDetailScreen}
        options={({ route }) => ({
          title: route.params.disco.nombre,
        })}
      />
      <Stack.Screen
        name="Artista"
        component={ArtistaScreen}
        options={{ title: 'Novedades' }}
      />
    </Stack.Navigator>
  );
}