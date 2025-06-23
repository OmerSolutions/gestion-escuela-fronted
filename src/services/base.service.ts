import { AxiosResponse } from 'axios';
import { apiClient, handleApiResponse, handleApiError } from './api.config';
import { RespuestaDto, RespuestaPaginadaDto } from '../types';

export abstract class BaseService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    // Obtener todos
    async obtenerTodos(): Promise<T[]> {
        try {
            const response: AxiosResponse<RespuestaDto<T[]>> = await apiClient.get(this.endpoint);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Obtener por ID
    async obtenerPorId(id: number | string): Promise<T> {
        try {
            const response: AxiosResponse<RespuestaDto<T>> = await apiClient.get(`${this.endpoint}/${id}`);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Crear
    async crear(data: CreateDto): Promise<T> {
        try {
            const response: AxiosResponse<RespuestaDto<T>> = await apiClient.post(this.endpoint, data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Actualizar
    async actualizar(id: number | string, data: UpdateDto): Promise<T> {
        try {
            const response: AxiosResponse<RespuestaDto<T>> = await apiClient.put(`${this.endpoint}/${id}`, data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Eliminar
    async eliminar(id: number | string): Promise<void> {
        try {
            await apiClient.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Búsqueda paginada (opcional)
    async buscarPaginado(params: any): Promise<RespuestaPaginadaDto<T>> {
        try {
            const response: AxiosResponse<RespuestaDto<RespuestaPaginadaDto<T>>> =
                await apiClient.get(`${this.endpoint}/buscar`, { params });
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}