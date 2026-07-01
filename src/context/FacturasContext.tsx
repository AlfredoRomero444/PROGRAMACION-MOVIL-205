import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Factura, FacturaItem } from '../types';

/**
 * Historial de facturas generadas al pagar el carrito.
 * Cada factura tiene un folio consecutivo (F-0001, F-0002, ...) y se
 * guarda en AsyncStorage para que el usuario pueda revisarla después,
 * como el historial de compras de cualquier tienda real.
 */

const FACTURAS_STORAGE_KEY = '@asyd_core_facturas';
const IVA = 0.16; // 16%, mismo criterio que la mayoría de comercios en México

interface FacturasContextType {
  facturas: Factura[];
  isFacturasReady: boolean;
  crearFactura: (items: FacturaItem[]) => Factura;
}

const FacturasContext = createContext<FacturasContextType>({
  facturas: [],
  isFacturasReady: false,
  crearFactura: () => {
    throw new Error('FacturasProvider no está montado');
  },
});

export function FacturasProvider({ children }: { children: React.ReactNode }) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [isFacturasReady, setIsFacturasReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(FACTURAS_STORAGE_KEY);
        if (saved) setFacturas(JSON.parse(saved));
      } catch (e) {
        // Si falla la lectura, arrancamos sin historial.
      } finally {
        setIsFacturasReady(true);
      }
    })();
  }, []);

  const crearFactura = (items: FacturaItem[]): Factura => {
    const subtotal = items.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0);
    const impuestos = Math.round(subtotal * IVA * 100) / 100;
    const total = Math.round((subtotal + impuestos) * 100) / 100;

    const folioNum = facturas.length + 1;
    const factura: Factura = {
      id: `${Date.now()}`,
      folio: `F-${String(folioNum).padStart(4, '0')}`,
      fecha: new Date().toISOString(),
      items,
      subtotal,
      impuestos,
      total,
    };

    const next = [factura, ...facturas];
    setFacturas(next);
    AsyncStorage.setItem(FACTURAS_STORAGE_KEY, JSON.stringify(next)).catch(() => {});

    return factura;
  };

  return (
    <FacturasContext.Provider value={{ facturas, isFacturasReady, crearFactura }}>
      {children}
    </FacturasContext.Provider>
  );
}

export function useFacturas() {
  return useContext(FacturasContext);
}
