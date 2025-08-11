import axios from 'axios';
import config from '../config/environment';

// Configuración base de la API
const API_BASE_URL = config.apiUrl;

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar headers de autenticación si los necesitas
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // Error del servidor con respuesta
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Error de red
      console.error('Network Error:', error.message);
    } else {
      // Otro tipo de error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
