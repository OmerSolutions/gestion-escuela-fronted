import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import { AsistenciaDto, ReporteAsistenciaDto } from '../types/asistencia.types';

class AsistenciaService {
    endpoint = '/asistencias';

    // Obtener asistencias por alumno
    async obtenerPorAlumno(alumnoDni: string): Promise<AsistenciaDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/alumno/${alumnoDni}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener todas las asistencias (admin/profesor)
    async obtenerTodos(params?: any): Promise<AsistenciaDto[]> {
        try {
            const response = await apiClient.get(this.endpoint, { params });
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Reporte de asistencias por filtro
    async reporte(params: { seccionId?: number; alumnoDni?: string; fechaInicio?: string; fechaFin?: string }): Promise<ReporteAsistenciaDto[]> {
        try {
            const response = await apiClient.get(`${this.endpoint}/reporte`, { params });
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const asistenciaService = new AsistenciaService();
