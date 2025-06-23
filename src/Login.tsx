import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { validators, validationMessages } from './utils/validator';
import { ROUTES } from './utils/constants';
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";
import { Loading } from "./Loading";

interface LoginForm {
    correo: string;
    contrasena: string;
}

interface FormErrors {
    correo?: string;
    contrasena?: string;
}

export const LoginPage: React.FC = () => {
    const { login, isAuthenticated, loading, error, clearError } = useAuth();
    const { showError, showSuccess } = useNotification();
    const location = useLocation();

    const [form, setForm] = useState<LoginForm>({
        correo: '',
        contrasena: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirigir si ya está autenticado
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
        return <Navigate to={from} replace />;
    }

    // Limpiar errores cuando cambie el formulario
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [form, error, clearError]);

    // Validar formulario
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!validators.isNotEmpty(form.correo)) {
            newErrors.correo = validationMessages.required;
        } else if (!validators.isValidEmail(form.correo)) {
            newErrors.correo = validationMessages.email;
        }

        if (!validators.isNotEmpty(form.contrasena)) {
            newErrors.contrasena = validationMessages.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Limpiar error del campo específico
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await login(form.correo, form.contrasena);
            showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
            showError('Error de autenticación', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loading message="Verificando autenticación..." fullScreen />;
    }

    return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div>
                        <div className="mx-auto h-12 w-12 bg-primary-color rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">GE</span>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Iniciar Sesión
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Accede a tu cuenta del sistema de gestión escolar
                        </p>
                    </div>

                    {/* Formulario */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Campo Email */}
                            <div>
                                <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={form.correo}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm ${
                                        errors.correo ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="tu@email.com"
                                />
                                {errors.correo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.correo}</p>
                                )}
                            </div>

                            {/* Campo Contraseña */}
                            <div>
                                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <input
                                    id="contrasena"
                                    name="contrasena"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={form.contrasena}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm ${
                                        errors.contrasena ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                />
                                {errors.contrasena && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contrasena}</p>
                                )}
                            </div>
                        </div>

                        {/* Botón de envío */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-color hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </div>

                        {/* Información adicional */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                ¿Problemas para acceder?{' '}
                                <a href="#" className="font-medium text-primary-color hover:text-primary-dark">
                                    Contacta al administrador
                                </a>
                            </p>
                        </div>
                    </form>

                    {/* Usuarios de prueba */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Usuarios de prueba:</h3>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p><strong>Admin:</strong> admin@test.com / 123456</p>
                            <p><strong>Profesor:</strong> profesor@test.com / 123456</p>
                            <p><strong>Alumno:</strong> alumno@test.com / 123456</p>
                        </div>
                    </div>
                </div>
        </div>
    );
};