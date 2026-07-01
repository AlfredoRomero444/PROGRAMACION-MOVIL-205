/**
 * Configuración centralizada de la app.
 *
 * Hoy AsydCore no consume ningún backend propio (los datos de discos/
 * artistas son estáticos, en src/services/DiscosService.tsx). Pero en
 * cuanto se conecte una API real, es mejor tener UN solo lugar con la
 * URL base y las llaves, en vez de escribir 'https://...' directo
 * dentro de cada pantalla.
 *
 * Para usar variables de entorno reales con Expo:
 *   1) instalar: npx expo install expo-constants
 *   2) definir las variables en app.config.ts -> extra: { API_BASE_URL: process.env.API_BASE_URL }
 *   3) leerlas aquí con Constants.expoConfig?.extra?.API_BASE_URL
 *
 * Mientras tanto, se deja un valor por defecto para desarrollo.
 */

export const ENV = {
  API_BASE_URL: 'https://api.asydcore.example.com',
  APP_VERSION: '1.0.0',
};
