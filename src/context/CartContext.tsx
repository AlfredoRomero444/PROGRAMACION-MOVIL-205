import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Disco } from '../types';

/**
 * Carrito de compras de la Music Store.
 * Persistido en AsyncStorage para que no se pierda si el usuario
 * cierra la app a la mitad de una compra.
 */

const CART_STORAGE_KEY = '@asyd_core_cart';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrecio: number;
  isCartReady: boolean;
  addToCart: (disco: Disco, cantidad?: number) => void;
  removeFromCart: (discoId: number) => void;
  updateCantidad: (discoId: number, cantidad: number) => void;
  clearCart: () => void;
  getCantidad: (discoId: number) => number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  totalItems: 0,
  totalPrecio: 0,
  isCartReady: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateCantidad: () => {},
  clearCart: () => {},
  getCantidad: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartReady, setIsCartReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (saved) setItems(JSON.parse(saved));
      } catch (e) {
        // Si falla la lectura, arrancamos con carrito vacío.
      } finally {
        setIsCartReady(true);
      }
    })();
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const addToCart = (disco: Disco, cantidad: number = 1) => {
    const existente = items.find((i) => i.disco.id === disco.id);
    if (existente) {
      persist(
        items.map((i) =>
          i.disco.id === disco.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
      );
    } else {
      persist([...items, { disco, cantidad }]);
    }
  };

  const removeFromCart = (discoId: number) => {
    persist(items.filter((i) => i.disco.id !== discoId));
  };

  const updateCantidad = (discoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(discoId);
      return;
    }
    persist(items.map((i) => (i.disco.id === discoId ? { ...i, cantidad } : i)));
  };

  const clearCart = () => persist([]);

  const getCantidad = (discoId: number) =>
    items.find((i) => i.disco.id === discoId)?.cantidad ?? 0;

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
  const totalPrecio = items.reduce((acc, i) => acc + i.cantidad * i.disco.precioActual, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrecio,
        isCartReady,
        addToCart,
        removeFromCart,
        updateCantidad,
        clearCart,
        getCantidad,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
