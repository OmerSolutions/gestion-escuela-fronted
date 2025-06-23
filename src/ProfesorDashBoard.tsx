import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from './utils/constants';
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";
import { Loading } from "./Loading";

// Tipos temporales hasta que tengamos los servicios
interface SeccionDto {
    id: number;
    nombre: string;
    cursoNombre: string;
    totalAlumnos?: number;
}

interface ProfesorStats {
    totalSecciones: number;
    totalAlumnos: number;
    asistenciasHoy: number;
    materialesSubidos: number;
}
// Funciones de formateo inline
const formatFullName = (nombre: string, apellido: string): string => {
    return `${nombre || ''} ${apellido || ''}`.trim();
};

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const ProfesorDashboard: React.FC = () => {
    const { user } = useAuth();
    const { showError } = useNotification();
    const [stats, setStats] = useState<ProfesorStats>({
        totalSecciones: 0,
        totalAlumnos: 0,
        asistenciasHoy: 0,
        materialesSubidos: 0,
    });
    const [secciones, setSecciones] = useState<SeccionDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // TODO: Implementar servicios reales
            // Por ahora usamos datos de ejemplo
            const mockSecciones: SeccionDto[] = [
                {
                    id: 1,
                    nombre: 'Matemáticas A',
                    cursoNombre: 'Matemáticas',
                    totalAlumnos: 25
                },
                {
                    id: 2,
                    nombre: 'Física B',
                    cursoNombre: 'Física',
                    totalAlumnos: 20
                }
            ];

            setSecciones(mockSecciones);

            // Calcular estadísticas
            const totalAlumnos = mockSecciones.reduce((total, seccion) =>
                total + (seccion.totalAlumnos || 0), 0
            );

            setStats({
                totalSecciones: mockSecciones.length,
                totalAlumnos,
                asistenciasHoy: 0,
                materialesSubidos: 0,
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showError('Error', 'No se pudieron cargar las estadísticas del dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Cargando dashboard..." fullScreen />;
    }

    const quickActions = [
        {
            title: 'Tomar Asistencia',
            description: 'Registrar asistencia de alumnos',
            icon: '✅',
            link: ROUTES.ASISTENCIAS,
            color: 'bg-green-500',
        },
        {
            title: 'Subir Material',
            description: 'Compartir material educativo',
            icon: '📄',
            link: ROUTES.MATERIALES,
            color: 'bg-blue-500',
        },
        {
            title: 'Ver Horarios',
            description: 'Consultar horarios de clases',
            icon: '🕐',
            link: ROUTES.HORARIOS,
            color: 'bg-purple-500',
        },
        {
            title: 'Gestionar Secciones',
            description: 'Administrar mis secciones',
            icon: '📋',
            link: ROUTES.SECCIONES,
            color: 'bg-orange-500',
        },
    ];

    const statsCards = [
        {
            title: 'Mis Secciones',
            value: stats.totalSecciones,
            icon: '📋',
            color: 'bg-blue-500',
        },
        {
            title: 'Total Alumnos',
            value: stats.totalAlumnos,
            icon: '🎓',
            color: 'bg-green-500',
        },
        {
            title: 'Asistencias Hoy',
            value: stats.asistenciasHoy,
            icon: '✅',
            color: 'bg-purple-500',
        },
        {
            title: 'Materiales',
            value: stats.materialesSubidos,
            icon: '📄',
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ¡Bienvenido, Profesor {formatFullName(user!.nombre, user!.apellido)}!
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Panel de profesor - {formatDate(new Date())}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Institución</p>
                        <p className="font-medium text-gray-900">{user!.institucionNombre}</p>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`${card.color} rounded-lg p-3 text-white text-2xl`}>
                                {card.icon}
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className="border border-gray-200 rounded-lg p-4 hover:border-primary-color hover:shadow-md transition-all"
                        >
                            <div className="text-center">
                                <div className={`${action.color} rounded-full w-12 h-12 flex items-center justify-center text-white text-xl mx-auto mb-3`}>
                                    {action.icon}
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mis Secciones */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mis Secciones</h2>
                {secciones.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {secciones.map((seccion) => (
                            <div key={seccion.id} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">{seccion.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Curso: {seccion.cursoNombre}
                                </p>
                                <p className="text-sm text-gray-600 mb-3">
                                    Alumnos: {seccion.totalAlumnos || 0}
                                </p>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`${ROUTES.ASISTENCIAS}?seccion=${seccion.id}`}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                    >
                                        Asistencia
                                    </Link>
                                    <Link
                                        to={`${ROUTES.MATERIALES}?seccion=${seccion.id}`}
                                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                                    >
                                        Materiales
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No tienes secciones asignadas</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Contacta al administrador para asignar secciones
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};