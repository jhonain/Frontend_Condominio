// shared/api/client.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://192.168.137.1:8083/api",
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 10000,
});

// ── Interceptor de REQUEST ──
apiClient.interceptors.request.use(
  async (config) => {
    // ← Rutas públicas que no necesitan token
    const publicRoutes = ["/auth/login", "/personas/personaUser"];
    const isPublic = publicRoutes.some(route => config.url?.includes(route));

    if (!isPublic) {
      // Solo busca y manda el token en rutas protegidas
      const token = await AsyncStorage.getItem("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API] Token adjuntado para: ${config.url}`);
      } else {
        console.warn(`[API] No hay token para ruta protegida: ${config.url}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de RESPONSE ──
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("jwt_token");
    }
    return Promise.reject(error);
  }
);