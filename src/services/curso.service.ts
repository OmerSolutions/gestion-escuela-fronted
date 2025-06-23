import { BaseService } from './base.service.ts';
import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import {CursoDto} from "@types/curso.types.ts";

class CursoService extends BaseService<CursoDto> {
    constructor() {
        super('/cursos');
    }

    // Obtener cursos por institución
    async obtenerPorInstitucion(institucionId: number): Promise<CursoDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/institucion/${institucionId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Buscar cursos por nombre
    async buscarPorNombre(termino: string): Promise<CursoDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/buscar`, {
                params: { termino }
            });
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener curso por código interno
    async obtenerPorCodigo(codigo: string): Promise<CursoDto> {
        try {
            const response = await apiClient.get(`${this.endpoint}/codigo/${codigo}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const cursoService = new CursoService();