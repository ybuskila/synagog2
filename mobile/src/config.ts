/**
 * API base URL. Set EXPO_PUBLIC_API_URL in Vercel (and ensure it applies to Build).
 * Direct reference so the bundler inlines it at build time.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__ ? 'http://localhost:3000/api' : 'https://your-api-domain.com/api');
