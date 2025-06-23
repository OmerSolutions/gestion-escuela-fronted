import { EntidadBase } from './index.ts';

export interface CursoDto extends EntidadBase {
    nombre: string;
    codigoInterno: string;
    institucionId: number;
    institucionNombre?: string;
    totalSecciones?: number;
}