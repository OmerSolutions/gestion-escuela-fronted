import { AxiosResponse } from 'axios';
import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import {LoginRequestDto, LoginResponseDto, UsuarioDto} from "../types/usuario.types";
import {RespuestaDto} from "@/types";

class AuthService {
    private readonly endpoint = '/auth';

    // Login
    async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
        try {
            const formData = new FormData();
            formData.append('username', credentials.correo);
            formData.append('password', credentials.contrasena);

            const response: AxiosResponse<RespuestaDto<LoginResponseDto>> =
                await apiClient.post(`${this.endpoint}/login`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

            const loginData = handleApiResponse(response);

            // Guardar datos en localStorage
            localStorage.setItem('auth_token', 'authenticated');
            localStorage.setItem('user_data', JSON.stringify(loginData.usuario));

            return loginData;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Logout
    async logout(): Promise<void> {
        try {
            await apiClient.post(`${this.endpoint}/logout`);
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar datos locales siempre
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        }
    }

    // Verificar si está autenticado
    isAuthenticated(): boolean {
        return localStorage.getItem('auth_token') !== null;
    }

    // Obtener usuario actual
    getCurrentUser(): UsuarioDto | null {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
        return null;
    }

    // Obtener rol del usuario actual
    getCurrentUserRole(): number | null {
        const user = this.getCurrentUser();
        return user ? user.rol : null;
    }

    // Verificar si el usuario tiene un rol específico
    hasRole(role: number): boolean {
        const currentRole = this.getCurrentUserRole();
        return currentRole === role;
    }

    // Verificar si es admin
    isAdmin(): boolean {
        return this.hasRole(2);
    }

    // Verificar si es profesor
    isProfesor(): boolean {
        return this.hasRole(1);
    }

    // Verificar si es alumno
    isAlumno(): boolean {
        return this.hasRole(0);
    }
}

export const authService = new AuthService()