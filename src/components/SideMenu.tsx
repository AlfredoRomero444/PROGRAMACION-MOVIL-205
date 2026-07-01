import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { House, Search, Disc3, ShoppingCart, Receipt, Library, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROUTE_ICONS: Record<string, any> = {
  Inicio: House,
  Explorar: Search,
  Tienda: Disc3,
  Carrito: ShoppingCart,
  Facturas: Receipt,
  Colección: Library,
  Perfil: User,
};

interface SideMenuProps {
  // Ref hacia el objeto navigation del Tab.Navigator (ver App.tsx).
  navigationRef: React.MutableRefObject<any>;
  colors: any;
  totalItems: number;
}

// ── Barra de navegación fija (ya NO es un menú desplegable) ────────────────
// Siempre visible, compacta, con ícono + nombre en cada pestaña. Reserva su
// propio espacio en el layout (no flota sobre el contenido) y respeta el
// inset inferior para que el gesto/barra de navegación de Android nunca la
// tape ni se sobreponga.
export default function SideMenu({ navigationRef, colors, totalItems }: SideMenuProps) {
  const insets = useSafeAreaInsets();

  const navState = navigationRef.current?.getState?.();
  const routes: { key: string; name: string }[] = navState?.routes ?? [];
  const activeIndex: number = navState?.index ?? 0;

  if (routes.length === 0) return null;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBorder,
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      {routes.map((route, index) => {
        const isFocused = index === activeIndex;
        const Icon = ROUTE_ICONS[route.name] ?? House;
        const tintColor = isFocused ? colors.accent : colors.textSecondary;

        const onPress = () => {
          navigationRef.current?.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.item}
          >
            <View style={styles.iconWrap}>
              <Icon color={tintColor} size={21} strokeWidth={2} />
              {route.name === 'Carrito' && totalItems > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </View>

            <Text style={[styles.label, { color: tintColor }]} numberOfLines={1}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    borderTopWidth: 1.5,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '700' },
});
