import { ImageSourcePropType } from 'react-native';

/**
 * Da formato a un precio en pesos mexicanos.
 * Ej: formatPrecio(520) -> "$520"
 */
export function formatPrecio(valor: number): string {
  return `$${valor.toLocaleString('es-MX')}`;
}

/**
 * Calcula el porcentaje de descuento entre el precio inicial y el actual.
 * Si el precio actual es mayor (como ocurre en subastas), regresa 0.
 */
export function calcularDescuento(
  precioInicial: number,
  precioActual: number
): number {
  if (precioActual >= precioInicial) return 0;
  const descuento =
    ((precioInicial - precioActual) / precioInicial) * 100;
  return Math.round(descuento);
}

/**
 * Convierte el campo `imagen` (que puede ser una URL string o un
 * resultado de require()) al formato que espera el componente <Image>.
 */
export function resolveImagen(
  imagen: string | number
): ImageSourcePropType {
  return typeof imagen === 'string' ? { uri: imagen } : imagen;
}

/**
 * Da formato a una fecha ISO ("2026-07-01") a un formato corto legible.
 * Ej: "1 jul"
 */
export function formatFechaCorta(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  return fecha.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Da formato a una fecha-hora ISO completa, para folios de factura.
 * Ej: "1 jul 2026, 14:32"
 */
export function formatFechaHora(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  const fechaTexto = fecha.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const horaTexto = fecha.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${fechaTexto}, ${horaTexto}`;
}