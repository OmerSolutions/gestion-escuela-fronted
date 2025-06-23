import { EntidadBase } from './index.ts';

export interface HorarioDto extends EntidadBase {
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    aula?: string;
    seccionId: number;
    seccionNombre?: string;
    cursoNombre?: string;
}