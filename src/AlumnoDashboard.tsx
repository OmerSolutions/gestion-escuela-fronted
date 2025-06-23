import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';


import {ROUTES} from '@utils/constants';
import {formatters} from '@utils/formatters';
import {useAuth} from "@/AuthContext.tsx";
import {useNotification} from "@/NotificationContext.tsx";
import {Loading} from "@/Loading.tsx";

interface AlumnoStats {
    asistenciasPresente: number;
    asistenciasAusente: number;
    materialesDisponibles: number;
    proximasClases: number;
}

export const AlumnoDashboard: React.FC = () => {
    const {user} = useAuth();
    const {showError} = useNotification();
    const [stats, setStats] = useState<AlumnoStats>({
        asistenciasPresente: 0,
        asistenciasAusente: 0,
        materialesDisponibles: 0,
        proximasClases: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // TODO: Implementar servicios para obtener datos del alumno
            // Por ahora usamos datos de ejemplo
            setStats({
                asistenciasPresente: 85,
                asistenciasAusente: 5,
                materialesDisponibles: 12,
                proximasClases: 3,
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showError('Error', 'No se pudieron cargar las estadísticas del dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Cargando dashboard..."/>;
    }

    const quickActions = [
        {
            title: 'Ver Asistencias',
            description: 'Consultar mi historial de asistencias',
            icon: '📊',
            link: ROUTES.ASISTENCIAS,
            color: 'bg-green-500',
        },
        {
            title: 'Materiales',
            description: 'Acceder a materiales de estudio',
            icon: '📚',
            link: ROUTES.MATERIALES,
            color: 'bg-blue-500',
        },
        {
            title: 'Horarios',
            description: 'Ver mis horarios de clases',
            icon: '🕐',
            link: ROUTES.HORARIOS,
            color: 'bg-purple-500',
        },
        {
            title: 'Mi Perfil',
            description: 'Actualizar información personal',
            icon: '👤',
            link: '/perfil',
            color: 'bg-orange-500',
        },
    ];

    const statsCards = [
        {
            title: 'Asistencias',
            value: stats.asistenciasPresente,
            subtitle: 'Presente',
            icon: '✅',
            color: 'bg-green-500',
        },
        {
            title: 'Ausencias',
            value: stats.asistenciasAusente,
            subtitle: 'Faltas',
            icon: '❌',
            color: 'bg-red-500',
        },
        {
            title: 'Materiales',
            value: stats.materialesDisponibles,
            subtitle: 'Disponibles',
            icon: '📄',
            color: 'bg-blue-500',
        },
        {
            title: 'Próximas Clases',
            value: stats.proximasClases,
            subtitle: 'Esta semana',
            icon: '📅',
            color: 'bg-purple-500',
        },
    ];

    const porcentajeAsistencia = Math.round(
        (stats.asistenciasPresente / (stats.asistenciasPresente + stats.asistenciasAusente)) * 100
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ¡Hola, {formatters.formatFullName(user!.nombre, user!.apellido)}!
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Panel de estudiante - {formatters.formatDate(new Date())}
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
                                <p className="text-xs text-gray-500">{card.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen de Asistencia */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Asistencia</h2>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Porcentaje de Asistencia</span>
                            <span className="text-sm font-bold text-gray-900">{porcentajeAsistencia}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${
                                    porcentajeAsistencia >= 90 ? 'bg-green-500' :
                                        porcentajeAsistencia >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{width: `${porcentajeAsistencia}%`}}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Presente: {stats.asistenciasPresente}</span>
                            <span>Ausente: {stats.asistenciasAusente}</span>
                        </div>
                    </div>
                </div>
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
                                <div
                                    className={`${action.color} rounded-full w-12 h-12 flex items-center justify-center text-white text-xl mx-auto mb-3`}>
                                    {action.icon}
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Próximas Clases */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximas Clases</h2>
                <div className="space-y-3">
                    {/* Ejemplo de próximas clases */}
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div
                            className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                            MAT
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">Matemáticas</h3>
                            <p className="text-sm text-gray-600">Hoy - 10:00 AM</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-blue-600">Aula 101</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div
                            className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                            ESP
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">Español</h3>
                            <p className="text-sm text-gray-600">Mañana - 8:00 AM</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-green-600">Aula 205</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                        <div
                            className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                            CIE
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">Ciencias</h3>
                            <p className="text-sm text-gray-600">Mañana - 2:00 PM</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-purple-600">Lab 1</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};