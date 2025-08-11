// Configuración de variables de entorno
export const config = {
  // URL de la API del backend
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Configuración de la aplicación
  appTitle: import.meta.env.VITE_APP_TITLE || 'Plataforma de Eventos Comunitarios',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Gestión de mingas, sembratones y actividades verdes',
  
  // Modo de desarrollo
  isDev: import.meta.env.DEV || false,
  
  // Configuración de la API
  apiTimeout: 10000, // 10 segundos
  maxRetries: 3,
  
  // Configuración de paginación
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;

// Validar configuración crítica
if (!config.apiUrl) {
  console.error('VITE_API_URL no está configurada. Usando valor por defecto: http://localhost:3000');
}

export default config;

