import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from './utils/constants';
import { useAuth } from "./AuthContext";

interface MenuItem {
    name: string;
    path: string;
    icon: React.ReactNode;
    roles: number[]; // Roles que pueden ver este item
}

export const Sidebar: React.FC = () => {
    const { user } = useAuth(); // Solo usamos lo que necesitamos

    const menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            path: ROUTES.DASHBOARD,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
            ),
            roles: [0, 1, 2], // Todos los roles
        },
        {
            name: 'Usuarios',
            path: ROUTES.USUARIOS,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            roles: [2], // Solo admin
        },
        {
            name: 'Alumnos',
            path: ROUTES.ALUMNOS,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" />
                </svg>
            ),
            roles: [1, 2], // Profesor y admin
        },
        {
            name: 'Cursos',
            path: ROUTES.CURSOS,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4h9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                </svg>
            ),
            roles: [1, 2],
        },
        {
            name: 'Secciones',
            path: ROUTES.SECCIONES,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            ),
            roles: [1, 2],
        },
        {
            name: 'Instituciones',
            path: ROUTES.INSTITUCIONES,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                </svg>
            ),
            roles: [2], // Solo admin
        },
        {
            name: 'Materiales',
            path: ROUTES.MATERIALES,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9M12 4h9M4 4h16v16H4z" />
                </svg>
            ),
            roles: [0, 1, 2], // Todos los roles
        },
        {
            name: 'Asistencias',
            path: ROUTES.ASISTENCIAS,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7V5a4 4 0 014-4h4" />
                </svg>
            ),
            roles: [0, 1, 2], // Todos los roles
        },
        // ... resto de items
    ];

    // Filtrar items según el rol del usuario
    const visibleItems = menuItems.filter(item =>
        user && item.roles.includes(user.rol)
    );

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
            <div className="flex flex-col h-full">
                {/* Header del sidebar */}
                <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Menú Principal</h2>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {visibleItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-primary-color text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer del sidebar */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.nombre} {user?.apellido}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.rol === 0 ? 'Alumno' : user?.rol === 1 ? 'Profesor' : 'Administrador'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};