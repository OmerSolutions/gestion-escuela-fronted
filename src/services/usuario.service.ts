import { BaseService } from './base.service.ts';
import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import {UsuarioDto} from "@types/usuario.types.ts";
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
}

export const usuarioService = new UsuarioService();