/**
 * API base URL. Set EXPO_PUBLIC_API_URL in eas.json or .env for production.
 * - Dev: http://localhost:3000/api (or your IP for physical device)
 * - Prod: from EXPO_PUBLIC_API_URL at build time
 */
export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  (__DEV__ ? 'http://localhost:3000/api' : 'https://your-api-domain.com/api');
