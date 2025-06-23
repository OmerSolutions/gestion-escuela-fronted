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

    return (
        <div className="p-2 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Panel de Administración</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-primary-light rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-primary-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 0A4 4 0 007 9V5a5 5 0 1110 0v4a4 4 0 01-3 3.87z" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.totalUsuarios}</div>
                        <div className="text-xs text-gray-700">Usuarios</div>
                    </div>
                </div>
                <div className="bg-green-100 rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-success-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.totalAlumnos}</div>
                        <div className="text-xs text-gray-700">Alumnos</div>
                    </div>
                </div>
                <div className="bg-blue-100 rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-info-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H9a1 1 0 00-1 1v9m0 0l4 4 4-4" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.totalCursos}</div>
                        <div className="text-xs text-gray-700">Cursos</div>
                    </div>
                </div>
                <div className="bg-yellow-100 rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-warning-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.totalSecciones}</div>
                        <div className="text-xs text-gray-700">Secciones</div>
                    </div>
                </div>
            </div>
        </div>
    );
};