import { RolUsuario } from './index.ts';

export interface UsuarioDto {
    id?: number;
    correo: string;
    contrasena?: string;
    rol: RolUsuario;
    nombre: string;
    apellido: string;
    activo?: boolean;
    fechaRegistro?: string;
    institucionId: number;
    institucionNombre?: string;
    dni?: string; // Relación con AlumnoDto
}

export interface LoginRequestDto {
    correo: string;
    contrasena: string;
}

export interface LoginResponseDto {
    mensaje: string;
    usuario: UsuarioDto;
    fechaLogin: string;
    tiempoExpiracion: number;
    institucionNombre: string;
}