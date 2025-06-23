import { EntidadBase } from './index.ts';

export interface SeccionDto extends EntidadBase {
    nombre: string;
    cursoId: number;
    cursoNombre?: string;
    profesorId: number;
    profesorNombre?: string;
    institucionId: number;
    institucionNombre?: string;
    totalHorarios?: number;
    totalMateriales?: number;
}