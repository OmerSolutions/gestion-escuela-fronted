export interface AlumnoDto {
    dni: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    correo: string;
    direccion?: string;
    numeroContacto?: string;
    institucionId: number;
    institucionNombre?: string;
}