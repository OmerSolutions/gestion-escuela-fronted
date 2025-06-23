import { EntidadBase } from './index.ts';

export interface MaterialDto extends EntidadBase {
    titulo: string;
    descripcion?: string;
    filePath: string;
    fechaSubida: string;
    seccionId: number;
    seccionNombre?: string;
    uploadedById: number;
    uploadedByNombre?: string;
}