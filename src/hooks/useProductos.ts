import { useState, useEffect } from 'react';
import { discos, artistas } from '../services/DiscosService';
import { Disco, Artista } from '../types';

/**
 * Hook personalizado que encapsula la lógica de carga
 * de productos (discos) y artistas de la tienda musical.
 */
export function useProductos() {
  // Almacena la lista de discos disponibles en el catálogo
  const [productos, setProductos] = useState<Disco[]>([]);

  // Controla si los datos aún se están cargando (muestra spinner mientras es true)
  const [cargando, setCargando] = useState<boolean>(true);

  // Simula la carga asíncrona de datos al montar el componente
  useEffect(() => {
    setCargando(true);

    // Simulamos una pequeña latencia como si viniera de un servicio real
    const timer = setTimeout(() => {
      setProductos(discos);
      setCargando(false);
    }, 800);

    // Limpieza: cancela el timer si el componente se desmonta antes
    return () => clearTimeout(timer);
  }, []);

  /**
   * Función auxiliar que recibe un artistaId y devuelve
   * el objeto Artista correspondiente (o undefined si no existe).
   */
  function getArtesano(artistaId: number): Artista | undefined {
    return artistas.find((a) => a.id === artistaId);
  }

  // Retorna los datos y utilidades que los componentes necesitan
  return { productos, cargando, getArtesano };
}