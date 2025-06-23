import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { AlumnoDashboard } from './AlumnoDashboard';
import {useAuth} from "@/AuthContext.tsx";
import {ProfesorDashboard} from "@/ProfesorDashBoard.tsx";

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Error de autenticación
                    </h2>
                    <p className="text-gray-600">No se pudo cargar la información del usuario</p>
                </div>
            </div>
        );
    }

    // Renderizar dashboard según el rol
    switch (user.rol) {
        case 2: // Admin
            return <div className="w-full max-w-4xl mx-auto"><AdminDashboard /></div>;
        case 1: // Profesor
            return <div className="w-full max-w-4xl mx-auto"><ProfesorDashboard /></div>;
        case 0: // Alumno
            return <div className="w-full max-w-4xl mx-auto"><AlumnoDashboard /></div>;
        default:
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Rol no reconocido
                        </h2>
                        <p className="text-gray-600">
                            Tu rol de usuario no está configurado correctamente
                        </p>
                    </div>
                </div>
            );
    }
};