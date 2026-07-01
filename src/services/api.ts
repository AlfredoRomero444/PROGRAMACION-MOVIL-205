import { ENV } from '../config/env';

/**
 * Cliente HTTP centralizado.
 *
 * En vez de repetir `fetch('https://...')` con manejo de errores
 * distinto en cada pantalla (como pasaba antes en ProfileScreen),
 * cualquier llamada a un backend real debería pasar por aquí. Así,
 * si un día cambia la URL base, el manejo de tokens, o el formato de
 * error, se cambia en un solo lugar.
 *
 * Ejemplo de uso una vez que exista un backend:
 *   const artistas = await apiGet<Artista[]>('/artistas');
 */

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${ENV.API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(`Error ${response.status} al llamar ${path}`, response.status);
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export { ApiError };
