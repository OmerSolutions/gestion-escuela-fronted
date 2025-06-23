import { BaseService } from './base.service';
import { apiClient, handleApiResponse, handleApiError } from './api.config';
import { CursoDto } from '../types/curso.types';

class CursoService extends BaseService<CursoDto> {
    constructor() {
        super('/cursos');
    }

    // Listar todos los cursos (sobrescribe el de BaseService)
    async obtenerTodos(): Promise<CursoDto[]> {
        try {
            const response = await apiClient.get(this.endpoint);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
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

    // Crear curso
    async crear(curso: CursoDto): Promise<CursoDto> {
        try {
            const response = await apiClient.post(this.endpoint, curso);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Actualizar curso
    async actualizar(id: number, curso: CursoDto): Promise<CursoDto> {
        try {
            const response = await apiClient.put(`${this.endpoint}/${id}`, curso);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Eliminar curso
    async eliminar(id: number): Promise<void> {
        try {
            await apiClient.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const cursoService = new CursoService();