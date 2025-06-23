// Utilidades para formatear datos
export const formatters = {
    // Formatear fecha
    formatDate: (date: string | Date): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    },

    // Formatear fecha y hora
    formatDateTime: (date: string | Date): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    // Formatear hora
    formatTime: (time: string): string => {
        return time.substring(0, 5); // HH:MM
    },

    // Formatear nombre completo
    formatFullName: (nombre: string, apellido: string): string => {
        return `${nombre} ${apellido}`;
    },

    // Formatear rol
    formatRole: (rol: number): string => {
        const roles = {
            0: 'Alumno',
            1: 'Profesor',
            2: 'Administrador',
        };
        return roles[rol as keyof typeof roles] || 'Desconocido';
    },

    // Formatear día de la semana
    formatDayOfWeek: (day: number): string => {
        const days = {
            1: 'Lunes',
            2: 'Martes',
            3: 'Miércoles',
            4: 'Jueves',
            5: 'Viernes',
            6: 'Sábado',
            7: 'Domingo',
        };
        return days[day as keyof typeof days] || 'Desconocido';
    },

    // Formatear porcentaje
    formatPercentage: (value: number): string => {
        return `${value.toFixed(1)}%`;
    },

    // Capitalizar primera letra
    capitalize: (text: string): string => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    // Truncar texto
    truncate: (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
};