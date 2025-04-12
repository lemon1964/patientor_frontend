// Локально
// export const apiBaseUrl = 'http://localhost:3001/api';

// Рендер и локально
// export const apiBaseUrl = '/api';

// // Vercel, Рендер и локально
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
