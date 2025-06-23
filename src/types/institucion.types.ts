import { EntidadBase } from './index.ts';

export interface InstitucionDto extends EntidadBase {
    nombre: string;
    codigo: string;
    totalUsuarios?: number;
    totalAlumnos?: number;
    totalCursos?: number;
}