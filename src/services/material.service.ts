import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
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

    // Puedes agregar más métodos según el OpenAPI
}

export const materialService = new MaterialService();
