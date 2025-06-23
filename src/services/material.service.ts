import { apiClient, handleApiResponse, handleApiError } from './api.config';
import { MaterialDto } from '../types/material.types';

class MaterialService {
    endpoint = '/materiales';

    // Obtener materiales por alumno (por usuario)
    async obtenerPorAlumno(usuarioId: number): Promise<MaterialDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/usuario/${usuarioId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // CRUD completo según OpenAPI
    async obtenerTodos(): Promise<MaterialDto[]> {
        try {
            const response = await apiClient.get(this.endpoint);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async crear(data: Partial<MaterialDto>): Promise<MaterialDto> {
        try {
            const response = await apiClient.post(this.endpoint, data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async actualizar(id: number, data: Partial<MaterialDto>): Promise<MaterialDto> {
        try {
            const response = await apiClient.put(`${this.endpoint}/${id}`, data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async eliminar(id: number): Promise<void> {
        try {
            await apiClient.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const materialService = new MaterialService();
