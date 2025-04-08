// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // ← relative base path, handled by Vite proxy
});

export default api;
