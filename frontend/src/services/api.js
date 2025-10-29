/**
 * Servicio de API para comunicación con el backend
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========================================
// AUTH
// ========================================
export const authService = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// ========================================
// USUARIOS
// ========================================
export const usuariosService = {
  getAll: async (skip = 0, limit = 100) => {
    const response = await api.get(`/usuarios?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  
  create: async (usuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },
  
  update: async (id, usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};

// ========================================
// AVENIDAS
// ========================================
export const avenidasService = {
  getAll: async () => {
    const response = await api.get('/avenidas');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/avenidas/${id}`);
    return response.data;
  },
  
  create: async (avenida) => {
    const response = await api.post('/avenidas', avenida);
    return response.data;
  },
  
  update: async (id, avenida) => {
    const response = await api.put(`/avenidas/${id}`, avenida);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/avenidas/${id}`);
    return response.data;
  },
};

// ========================================
// TIPOS DE SINIESTRO
// ========================================
export const tiposSiniestroService = {
  getAll: async () => {
    const response = await api.get('/tipos-siniestro');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/tipos-siniestro/${id}`);
    return response.data;
  },
  
  create: async (tipo) => {
    const response = await api.post('/tipos-siniestro', tipo);
    return response.data;
  },
  
  update: async (id, tipo) => {
    const response = await api.put(`/tipos-siniestro/${id}`, tipo);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/tipos-siniestro/${id}`);
    return response.data;
  },
};

// ========================================
// SINIESTROS
// ========================================
export const siniestrosService = {
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, avenida_id, tipo_id, nivel_gravedad } = params;
    let url = `/siniestros?skip=${skip}&limit=${limit}`;
    
    if (avenida_id) url += `&avenida_id=${avenida_id}`;
    if (tipo_id) url += `&tipo_id=${tipo_id}`;
    if (nivel_gravedad) url += `&nivel_gravedad=${nivel_gravedad}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/siniestros/${id}`);
    return response.data;
  },
  
  create: async (siniestro) => {
    const response = await api.post('/siniestros', siniestro);
    return response.data;
  },
  
  update: async (id, siniestro) => {
    const response = await api.put(`/siniestros/${id}`, siniestro);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/siniestros/${id}`);
    return response.data;
  },
  
  count: async (params = {}) => {
    const { avenida_id, tipo_id, nivel_gravedad } = params;
    let url = '/siniestros/count';
    const queryParams = [];
    
    if (avenida_id) queryParams.push(`avenida_id=${avenida_id}`);
    if (tipo_id) queryParams.push(`tipo_id=${tipo_id}`);
    if (nivel_gravedad) queryParams.push(`nivel_gravedad=${nivel_gravedad}`);
    
    if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
    
    const response = await api.get(url);
    return response.data;
  },
};

// ========================================
// VEHÍCULOS
// ========================================
export const vehiculosService = {
  getBySiniestro: async (siniestroId) => {
    const response = await api.get(`/vehiculos/siniestro/${siniestroId}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  },
  
  create: async (vehiculo) => {
    const response = await api.post('/vehiculos', vehiculo);
    return response.data;
  },
  
  update: async (id, vehiculo) => {
    const response = await api.put(`/vehiculos/${id}`, vehiculo);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data;
  },
};

// ========================================
// REPORTES
// ========================================
export const reportesService = {
  getResumenGeneral: async () => {
    const response = await api.get('/reportes/resumen-general');
    return response.data;
  },
  
  getSiniestrosPorZona: async () => {
    const response = await api.get('/reportes/siniestros-por-zona');
    return response.data;
  },
  
  getAvenidasPeligrosas: async () => {
    const response = await api.get('/reportes/avenidas-peligrosas');
    return response.data;
  },
  
  getEstadisticasPorTipo: async () => {
    const response = await api.get('/reportes/estadisticas-por-tipo');
    return response.data;
  },
  
  getAnalisisVehiculos: async () => {
    const response = await api.get('/reportes/analisis-vehiculos');
    return response.data;
  },
  
  getSiniestrosPorMes: async () => {
    const response = await api.get('/reportes/siniestros-por-mes');
    return response.data;
  },
  
  getSiniestrosPorDiaSemana: async () => {
    const response = await api.get('/reportes/siniestros-por-dia-semana');
    return response.data;
  },
  
  getHorariosCriticos: async () => {
    const response = await api.get('/reportes/horarios-criticos');
    return response.data;
  },
  
  getTopMarcas: async (limit = 10) => {
    const response = await api.get(`/reportes/top-marcas-involucradas?limit=${limit}`);
    return response.data;
  },
};

export default api;