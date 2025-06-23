import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@utils/constants';
import {useAuth} from "@/AuthContext.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: number;
    requiredRoles?: number[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredRole,
                                                                  requiredRoles,
                                                              }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white/80 backdrop-blur-sm">
                <div className="animate-spin rounded-full border-4 border-primary-color border-t-transparent w-10 h-10 mb-4"></div>
                <span className="text-primary-color text-lg font-semibold">Verificando autenticación...</span>
            </div>
        );
    }

    // Redirigir al login si no está autenticado
    if (!isAuthenticated || !user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // Verificar rol específico
    if (requiredRole !== undefined && user.rol !== requiredRole) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="card text-center p-8 rounded-xl shadow bg-white">
                    <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
                    <p className="text-secondary mb-4">
                        No tienes permisos para acceder a esta página.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-primary"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    // Verificar múltiples roles
    if (requiredRoles && !requiredRoles.includes(user.rol)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="card text-center p-8 rounded-xl shadow bg-white">
                    <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
                    <p className="text-secondary mb-4">
                        No tienes permisos para acceder a esta página.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-primary"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};