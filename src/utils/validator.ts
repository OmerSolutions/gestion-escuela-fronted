export const validators = {
    isNotEmpty: (value: string): boolean => {
        return value !== null && value !== undefined && value.trim().length > 0;
    },

    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isMinLength: (value: string, minLength: number): boolean => {
        return value.length >= minLength;
    },

    isMaxLength: (value: string, maxLength: number): boolean => {
        return value.length <= maxLength;
    },

    isValidPassword: (password: string): boolean => {
        // Al menos 6 caracteres
        return password.length >= 6;
    },

    isValidDNI: (dni: string): boolean => {
        // Validación básica de DNI (8 dígitos)
        const dniRegex = /^\d{8}$/;
        return dniRegex.test(dni);
    },

    isValidPhone: (phone: string): boolean => {
        // Validación básica de teléfono
        const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
        return phoneRegex.test(phone);
    },

    isValidDate: (date: string): boolean => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    },

    isValidTime: (time: string): boolean => {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }
};

export const validationMessages = {
    required: 'Este campo es obligatorio',
    email: 'Ingrese un correo electrónico válido',
    minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
    maxLength: (max: number) => `No puede tener más de ${max} caracteres`,
    password: 'La contraseña debe tener al menos 6 caracteres',
    dni: 'El DNI debe tener 8 dígitos',
    phone: 'Ingrese un número de teléfono válido',
    date: 'Ingrese una fecha válida',
    time: 'Ingrese una hora válida (HH:MM)',
    match: 'Los campos no coinciden',
    numeric: 'Solo se permiten números',
    alphanumeric: 'Solo se permiten letras y números'
}