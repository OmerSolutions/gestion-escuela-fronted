// Constantes de la aplicación
export const APP_CONFIG = {
    NAME: 'Gestión Escolar',
    VERSION: '1.0.0',
    API_TIMEOUT: 10000,
    ITEMS_PER_PAGE: 10,
} as const;

// Roles de usuario
export const ROLES = {
    ALUMNO: 0,
    PROFESOR: 1,
    ADMIN: 2,
} as const;

export const ROLE_NAMES = {
    [ROLES.ALUMNO]: 'Alumno',
    [ROLES.PROFESOR]: 'Profesor',
    [ROLES.ADMIN]: 'Administrador',
} as const;

// Estados de asistencia
export const ESTADOS_ASISTENCIA = {
    PRESENTE: 'Presente',
    AUSENTE: 'Ausente',
    TARDE: 'Tarde',
    JUSTIFICADO: 'Justificado',
} as const;

// Días de la semana
export const DIAS_SEMANA = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo',
} as const;

// Rutas de la aplicación
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    USUARIOS: '/usuarios',
    ALUMNOS: '/alumnos',
    CURSOS: '/cursos',
    SECCIONES: '/secciones',
    HORARIOS: '/horarios',
    ASISTENCIAS: '/asistencias',
    MATERIALES: '/materiales',
    INSTITUCIONES: '/instituciones',
} as const;

// Mensajes de la aplicación
export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Registro creado exitosamente',
        UPDATED: 'Registro actualizado exitosamente',
        DELETED: 'Registro eliminado exitosamente',
        LOGIN: 'Inicio de sesión exitoso',
        LOGOUT: 'Sesión cerrada exitosamente',
    },
    ERROR: {
        GENERIC: 'Ha ocurrido un error inesperado',
        NETWORK: 'Error de conexión. Verifique su conexión a internet',
        UNAUTHORIZED: 'No tiene permisos para realizar esta acción',
        NOT_FOUND: 'El recurso solicitado no fue encontrado',
        VALIDATION: 'Por favor, corrija los errores en el formulario',
    },
    CONFIRM: {
        DELETE: '¿Está seguro de que desea eliminar este registro?',
        LOGOUT: '¿Está seguro de que desea cerrar sesión?',
    },
} as const;