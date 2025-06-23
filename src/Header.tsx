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
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to={ROUTES.HOME || ROUTES.DASHBOARD} className="flex items-center">
                            <div className="w-8 h-8 bg-primary-color rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">GE</span>
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                Gestión Escolar
                            </span>
                        </Link>
                    </div>

                    {/* User Menu */}
                    {isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-color"
                            >
                                <div className="w-8 h-8 bg-primary-color rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium">
                                        {getInitials(user.nombre, user.apellido)}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatFullName(user.nombre, user.apellido)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatRole(user.rol)}
                                    </div>
                                </div>
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatFullName(user.nombre, user.apellido)}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.correo}</p>
                                    </div>

                                    <Link
                                        to="/perfil"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        Mi Perfil
                                    </Link>

                                    <Link
                                        to="/configuracion"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        Configuración
                                    </Link>

                                    <div className="border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                to={ROUTES.LOGIN}
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};