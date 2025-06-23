import { apiClient, handleApiResponse, handleApiError } from './api.config.ts';
import { AsistenciaDto } from '../types/asistencia.types';

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

    // Puedes agregar más métodos según el OpenAPI
}

export const asistenciaService = new AsistenciaService();
