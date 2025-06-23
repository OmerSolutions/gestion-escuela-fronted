import { BaseService } from './base.service.ts';
import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import { UsuarioDto } from '../types/usuario.types';
import {RolUsuario} from "@/types";

class UsuarioService extends BaseService<UsuarioDto> {
    constructor() {
        super('/usuarios');
    }

    // Obtener usuario por correo
    async obtenerPorCorreo(correo: string): Promise<UsuarioDto> {
        try {
            const response = await apiClient.get(`${this.endpoint}/correo/${correo}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener usuarios por rol
    async obtenerPorRol(rol: RolUsuario): Promise<UsuarioDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/rol/${rol}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener usuarios por institución
    async obtenerPorInstitucion(institucionId: number): Promise<UsuarioDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/institucion/${institucionId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Desactivar usuario
    async desactivar(id: number): Promise<void> {
        try {
            await apiClient.patch(`${this.endpoint}/${id}/desactivar`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Listar todos los usuarios (sobrescribe el de BaseService)
    async obtenerTodos(): Promise<UsuarioDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/listar`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Buscar usuario por ID
    async obtenerPorId(id: number): Promise<UsuarioDto> {
        try {
            const response = await apiClient.get(`${this.endpoint}/buscar/id/${id}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Crear usuario
    async crear(usuario: UsuarioDto): Promise<UsuarioDto> {
        try {
            const response = await apiClient.post(`${this.endpoint}/crear`, usuario);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Actualizar usuario
    async actualizar(id: number, usuario: UsuarioDto): Promise<UsuarioDto> {
        try {
            const response = await apiClient.put(`${this.endpoint}/actualizar/${id}`, usuario);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Eliminar usuario
    async eliminar(id: number): Promise<void> {
        try {
            await apiClient.delete(`${this.endpoint}/eliminar/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Activar usuario
    async activar(id: number): Promise<void> {
        try {
            await apiClient.patch(`${this.endpoint}/activar/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const usuarioService = new UsuarioService();