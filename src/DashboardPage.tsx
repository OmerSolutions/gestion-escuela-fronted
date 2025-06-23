import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { AlumnoDashboard } from './AlumnoDashboard';
import {useAuth} from "@/AuthContext.tsx";
import {ProfesorDashboard} from "@/ProfesorDashBoard.tsx";

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
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
            return <AdminDashboard />;
        case 1: // Profesor
            return <ProfesorDashboard />;
        case 0: // Alumno
            return <AlumnoDashboard />;
        default:
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900">
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