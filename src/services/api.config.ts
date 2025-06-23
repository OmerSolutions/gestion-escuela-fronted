import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {RespuestaDto} from '../types';

// Configuración base de Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Crear instancia de Axios
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Asegura el envío de cookies de sesión (JSESSIONID)
});

// Interceptor para requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Error en request:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ Error en response:', error);

        // Manejar errores de autenticación
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Función helper para manejar respuestas de la API
export const handleApiResponse = <T>(response: AxiosResponse<RespuestaDto<T>>): T => {
    if (response.data.exito) {
        return response.data.datos;
    } else {
        throw new Error(response.data.error || response.data.mensaje);
    }
};

// Función helper para manejar errores de la API
export const handleApiError = (error: any): string => {
    if (error.response?.data?.mensaje) {
        return error.response.data.mensaje;
    } else if (error.message) {
        return error.message;
    } else {
        return 'Error desconocido';
    }
};
