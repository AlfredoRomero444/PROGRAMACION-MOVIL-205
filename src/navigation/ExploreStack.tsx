import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ExploreScreen from '../screens/ExploreScreen';
import ExploreDetailScreen from '../screens/ExploreDetailScreen';
import { Disco, Artista } from '../types';

// ── Tipos tipados del Stack ──────────────────────────────────────
export type ExploreStackParamList = {
  ExploreList: undefined;
  ExploreDetail: {
    disco: Disco;
    artista: Artista | undefined;
  };
};

export type ExploreListProps   = NativeStackScreenProps<ExploreStackParamList, 'ExploreList'>;
export type ExploreDetailProps = NativeStackScreenProps<ExploreStackParamList, 'ExploreDetail'>;

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export default function ExploreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:       { backgroundColor: '#090912' },
        headerTintColor:   '#bf5af2',
        headerTitleStyle:  { color: '#fff', fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        contentStyle:      { backgroundColor: '#090912' },
      }}
    >
      <Stack.Screen
        name="ExploreList"
        component={ExploreScreen}
        options={{ headerShown: false }}   // ExploreScreen ya tiene su propio header visual
      />
      <Stack.Screen
        name="ExploreDetail"
        component={ExploreDetailScreen}
        options={({ route }) => ({
          title: route.params.disco.nombre,  // título dinámico
        })}
      />
    </Stack.Navigator>
  );
}