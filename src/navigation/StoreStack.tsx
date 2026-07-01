import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import StoreScreen from '../screens/StoreScreen';
import StoreDetailScreen from '../screens/StoreDetailScreen';
import { Disco, Artista } from '../types';
import { useTheme } from '../context/ThemeContext';

export type StoreStackParamList = {
  StoreList: undefined;
  StoreDetail: {
    disco: Disco;
    artista: Artista | undefined;
  };
};

export type StoreListProps   = NativeStackScreenProps<StoreStackParamList, 'StoreList'>;
export type StoreDetailProps = NativeStackScreenProps<StoreStackParamList, 'StoreDetail'>;

const Stack = createNativeStackNavigator<StoreStackParamList>();

export default function StoreStack() {
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
        name="StoreList"
        component={StoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoreDetail"
        component={StoreDetailScreen}
        options={({ route }) => ({
          title: route.params.disco.nombre,
        })}
      />
    </Stack.Navigator>
  );
}
