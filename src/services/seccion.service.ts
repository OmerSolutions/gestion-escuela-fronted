import { BaseService } from './base.service.ts';
import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import {SeccionDto} from "@types/seccion.types.ts";

class SeccionService extends BaseService<SeccionDto> {
    constructor() {
        super('/secciones');
    }

    // Obtener secciones por curso
    async obtenerPorCurso(cursoId: number): Promise<SeccionDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/curso/${cursoId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener secciones por profesor
    async obtenerPorProfesor(profesorId: number): Promise<SeccionDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/profesor/${profesorId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener secciones por institución
    async obtenerPorInstitucion(institucionId: number): Promise<SeccionDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/institucion/${institucionId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const seccionService = new SeccionService();