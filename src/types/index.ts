export interface RespuestaDto<T> {
    exito: boolean;
    mensaje: string;
    datos: T;
    error?: string;
}

// Tipos de roles
export enum RolUsuario {
    ALUMNO = 0,
    PROFESOR = 1,
    ADMIN = 2
}

// Tipo base para entidades con ID
export interface EntidadBase {
    id: number;
}

// Tipo para paginación
export interface PaginacionDto {
    pagina: number;
    tamaño: number;
    total: number;
    totalPaginas: number;
}

export interface RespuestaPaginadaDto<T> {
    contenido: T[];
    paginacion: PaginacionDto;
}