import { BaseService } from './base.service';
import { apiClient, handleApiResponse, handleApiError } from './api.config';
import { InstitucionDto } from '../types/institucion.types';

class InstitucionService extends BaseService<InstitucionDto> {
    constructor() {
        super('/instituciones');
    }

    // Obtener institución por código
    async obtenerPorCodigo(codigo: string): Promise<InstitucionDto> {
        try {
            const response = await apiClient.get(`${this.endpoint}/codigo/${codigo}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Verificar si existe código
    async existeCodigo(codigo: string): Promise<boolean> {
        try {
            const response = await apiClient.get(`${this.endpoint}/existe-codigo/${codigo}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const institucionService = new InstitucionService();