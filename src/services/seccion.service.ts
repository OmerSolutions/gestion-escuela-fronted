import { BaseService } from './base.service';
import { apiClient, handleApiResponse, handleApiError } from './api.config';
import { SeccionDto } from '../types/seccion.types';

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

    // Crear sección
    async crear(seccion: SeccionDto): Promise<SeccionDto> {
        try {
            const response = await apiClient.post(this.endpoint, seccion);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Actualizar sección
    async actualizar(id: number, seccion: SeccionDto): Promise<SeccionDto> {
        try {
            const response = await apiClient.put(`${this.endpoint}/${id}`, seccion);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Eliminar sección
    async eliminar(id: number): Promise<void> {
        try {
            await apiClient.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const seccionService = new SeccionService();