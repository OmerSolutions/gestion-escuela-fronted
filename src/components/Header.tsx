import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from './utils/constants';
import { useAuth } from "./AuthContext";

// Funciones de formateo inline para evitar dependencias
const getInitials = (nombre: string, apellido: string): string => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
};

const formatFullName = (nombre: string, apellido: string): string => {
    return `${nombre || ''} ${apellido || ''}`.trim();
};

const formatRole = (rol: number): string => {
    switch (rol) {
        case 0: return 'Alumno';
        case 1: return 'Profesor';
        case 2: return 'Administrador';
        default: return 'Usuario';
    }
};

export const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to={ROUTES.HOME || ROUTES.DASHBOARD} className="flex items-center">
                            <div className="w-10 h-10 bg-primary-color rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-xl">GE</span>
                            </div>
                            <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">
                                Gestión Escolar
                            </span>
                        </Link>
                    </div>
                    {/* User Menu */}
                    {isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-color px-2 py-1 hover:bg-primary-light transition"
                            >
                                <div className="w-9 h-9 bg-primary-color rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-lg">{getInitials(user.nombre, user.apellido)}</span>
                                </div>
                                <span className="hidden sm:block font-semibold text-gray-700">{formatFullName(user.nombre, user.apellido)}</span>
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 animate-fade-in z-50">
                                    <div className="px-4 py-2 text-xs text-gray-500 border-b">{formatRole(user.rol)}</div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar sesión</button>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};