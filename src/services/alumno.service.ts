import { BaseService } from './base.service.ts';
import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import {AlumnoDto} from "@types/alumno.types.ts";

class AlumnoService extends BaseService<AlumnoDto, AlumnoDto, AlumnoDto> {
    constructor() {
        super('/alumnos');
    }

    // Obtener por ID (DNI en este caso)
    async obtenerPorId(dni: string): Promise<AlumnoDto> {
        try {
            const response = await apiClient.get(`${this.endpoint}/${dni}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener alumno por correo
    async obtenerPorCorreo(correo: string): Promise<AlumnoDto> {
        try {
            const response = await apiClient.get(`${this.endpoint}/correo/${correo}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener alumnos por institución
    async obtenerPorInstitucion(institucionId: number): Promise<AlumnoDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/institucion/${institucionId}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Buscar alumnos por nombre
    async buscarPorNombre(termino: string): Promise<AlumnoDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/buscar`, {
                params: { termino }
            });
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Crear alumno
    async crear(alumno: AlumnoDto): Promise<AlumnoDto> {
        try {
            const response = await apiClient.post(this.endpoint, alumno);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Actualizar alumno
    async actualizar(dni: string, alumno: AlumnoDto): Promise<AlumnoDto> {
        try {
            const response = await apiClient.put(`${this.endpoint}/${dni}`, alumno);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Eliminar alumno
    async eliminar(dni: string): Promise<void> {
        try {
            await apiClient.delete(`${this.endpoint}/${dni}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const alumnoService = new AlumnoService();