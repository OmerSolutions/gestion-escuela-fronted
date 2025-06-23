import { EntidadBase } from './index.ts';

export interface AsistenciaDto extends EntidadBase {
    fecha: string;
    estado: 'Presente' | 'Ausente' | 'Tarde' | 'Justificado';
    alumnoDni: string;
    alumnoNombre?: string;
    seccionId: number;
    seccionNombre?: string;
    cursoNombre?: string;
}

export interface ReporteAsistenciaDto {
    alumnoDni: string;
    alumnoNombre: string;
    seccionId?: number;
    seccionNombre?: string;
    totalClases: number;
    totalPresentes: number;
    totalAusentes: number;
    totalTardes: number;
    totalJustificados: number;
    porcentajeAsistencia: number;
    fechaInicio: string;
    fechaFin: string;
}