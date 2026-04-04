/** FastAPI base URL. Override with VITE_API_BASE_URL in frontend/.env */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')) ||
  'http://localhost:8001';
