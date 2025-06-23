import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {usuarioService} from '@services/usuario.service';
import {alumnoService} from '@services/alumno.service';
import {cursoService} from '@services/curso.service';
import {ROUTES} from '@utils/constants';
import {formatters} from '@utils/formatters';
import {useAuth} from "@/AuthContext.tsx";
import {useNotification} from "@/NotificationContext.tsx";
import {Loading} from "@/Loading.tsx";

interface DashboardStats {
    totalUsuarios: number;
    totalAlumnos: number;
    totalCursos: number;
    totalSecciones: number;
}

export const AdminDashboard: React.FC = () => {
    const {user} = useAuth();
    const {showError} = useNotification();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsuarios: 0,
        totalAlumnos: 0,
        totalCursos: 0,
        totalSecciones: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Cargar estadísticas en paralelo
            const [usuarios, alumnos, cursos] = await Promise.all([
                usuarioService.obtenerTodos(),
                alumnoService.obtenerTodos(),
                cursoService.obtenerTodos(),
            ]);

            setStats({
                totalUsuarios: usuarios.length,
                totalAlumnos: alumnos.length,
                totalCursos: cursos.length,
                totalSecciones: 0, // TODO: Implementar cuando tengamos el servicio
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
            title: 'Crear Usuario',
            description: 'Agregar nuevo usuario al sistema',
            icon: '👤',
            link: `${ROUTES.USUARIOS}/nuevo`,
            color: 'bg-blue-500',
        },
        {
            title: 'Registrar Alumno',
            description: 'Agregar nuevo alumno',
            icon: '🎓',
            link: `${ROUTES.ALUMNOS}/nuevo`,
            color: 'bg-green-500',
        },
        {
            title: 'Crear Curso',
            description: 'Agregar nuevo curso',
            icon: '📚',
            link: `${ROUTES.CURSOS}/nuevo`,
            color: 'bg-purple-500',
        },
        {
            title: 'Gestionar Institución',
            description: 'Configurar institución',
            icon: '🏫',
            link: ROUTES.INSTITUCIONES,
            color: 'bg-orange-500',
        },
    ];

    const statsCards = [
        {
            title: 'Total Usuarios',
            value: stats.totalUsuarios,
            icon: '👥',
            color: 'bg-blue-500',
            link: ROUTES.USUARIOS,
        },
        {
            title: 'Total Alumnos',
            value: stats.totalAlumnos,
            icon: '🎓',
            color: 'bg-green-500',
            link: ROUTES.ALUMNOS,
        },
        {
            title: 'Total Cursos',
            value: stats.totalCursos,
            icon: '📚',
            color: 'bg-purple-500',
            link: ROUTES.CURSOS,
        },
        {
            title: 'Total Secciones',
            value: stats.totalSecciones,
            icon: '📋',
            color: 'bg-orange-500',
            link: ROUTES.SECCIONES,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ¡Bienvenido, {formatters.formatFullName(user!.nombre, user!.apellido)}!
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Panel de administración - {formatters.formatDate(new Date())}
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
                    <Link
                        key={index}
                        to={card.link}
                        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block"
                    >
                        <div className="flex items-center">
                            <div className={`${card.color} rounded-lg p-3 text-white text-2xl`}>
                                {card.icon}
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    </Link>
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

            {/* Actividad Reciente */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
                <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">Sistema iniciado correctamente</p>
                            <p className="text-xs text-gray-500">{formatters.formatDateTime(new Date())}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">Dashboard cargado</p>
                            <p className="text-xs text-gray-500">{formatters.formatDateTime(new Date())}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};