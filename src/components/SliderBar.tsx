import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
    name: string;
    path: string;
    icon: React.ReactNode;
    roles: number[];
    hideIfAuth?: boolean;
}

export const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            path: ROUTES.DASHBOARD,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
            ),
            roles: [0, 1, 2],
        },
        {
            name: 'Usuarios',
            path: ROUTES.USUARIOS,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            roles: [2],
        },
        {
            name: 'Alumnos',
            path: ROUTES.ALUMNOS,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" />
                </svg>
            ),
            roles: [1, 2],
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
            name: 'Horarios',
            path: ROUTES.HORARIOS,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
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
            roles: [2],
        },
        {
            name: 'Materiales',
            path: ROUTES.MATERIALES,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h8v8H8z" />
                </svg>
            ),
            roles: [0, 1, 2],
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
            roles: [0, 1, 2],
        },
        {
            name: 'Inicio',
            path: ROUTES.HOME,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3" />
                </svg>
            ),
            roles: [0, 1, 2],
            hideIfAuth: true,
        },
        {
            name: 'Login',
            path: ROUTES.LOGIN,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m6-6l-6 6 6 6" />
                </svg>
            ),
            roles: [0, 1, 2],
            hideIfAuth: true,
        },
    ];
    return (
        <aside className="fixed left-0 top-0 h-full w-20 sm:w-56 bg-white border-r shadow-lg flex flex-col z-30 transition-all duration-200" aria-label="Sidebar de navegación">
            <div className="flex items-center justify-center h-16 border-b">
                <div className="w-10 h-10 bg-primary-color rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">GE</span>
                </div>
            </div>
            <nav className="flex-1 flex flex-col gap-2 mt-4 px-2" aria-label="Menú principal">
                {menuItems.filter(item => {
                    if (!user && item.hideIfAuth) return true;
                    if (user && item.hideIfAuth) return false;
                    return user && item.roles.includes(user.rol);
                }).map(item => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-color ${isActive ? 'bg-primary-color text-white shadow' : 'text-gray-700 hover:bg-primary-light hover:text-primary-color'}`
                        }
                        tabIndex={0}
                        aria-label={item.name}
                    >
                        <span className="w-7 h-7 flex items-center justify-center">{item.icon}</span>
                        <span className="hidden sm:inline-block">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};