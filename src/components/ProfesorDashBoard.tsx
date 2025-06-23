import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Loading } from './Loading';

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
            // Aquí deberías llamar a los servicios reales
            const mockSecciones: SeccionDto[] = [
                { id: 1, nombre: 'Matemáticas A', cursoNombre: 'Matemáticas', totalAlumnos: 25 },
                { id: 2, nombre: 'Física B', cursoNombre: 'Física', totalAlumnos: 20 }
            ];
            setSecciones(mockSecciones);
            const totalAlumnos = mockSecciones.reduce((total, seccion) => total + (seccion.totalAlumnos || 0), 0);
            setStats({
                totalSecciones: mockSecciones.length,
                totalAlumnos,
                asistenciasHoy: 0,
                materialesSubidos: 0,
            });
        } catch (error) {
            showError('Error', 'No se pudieron cargar las estadísticas del dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Cargando dashboard..." />;
    }

    return (
        <div className="p-2 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Panel del Profesor</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-primary-light rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-primary-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 0A4 4 0 007 9V5a5 5 0 1110 0v4a4 4 0 01-3 3.87z" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.totalSecciones}</div>
                        <div className="text-xs text-gray-700">Secciones</div>
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
                        <div className="text-lg font-bold">{stats.asistenciasHoy}</div>
                        <div className="text-xs text-gray-700">Asistencias hoy</div>
                    </div>
                </div>
                <div className="bg-yellow-100 rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-warning-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.materialesSubidos}</div>
                        <div className="text-xs text-gray-700">Materiales subidos</div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mis Secciones</h2>
                {secciones.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {secciones.map((seccion) => (
                            <div key={seccion.id} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">{seccion.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-2">Curso: {seccion.cursoNombre}</p>
                                <p className="text-sm text-gray-600 mb-3">Alumnos: {seccion.totalAlumnos || 0}</p>
                                <div className="flex space-x-2">
                                    <Link to={`${ROUTES.ASISTENCIAS}?seccion=${seccion.id}`} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Asistencia</Link>
                                    <Link to={`${ROUTES.MATERIALES}?seccion=${seccion.id}`} className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">Materiales</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No tienes secciones asignadas</p>
                        <p className="text-sm text-gray-400 mt-1">Contacta al administrador para asignar secciones</p>
                    </div>
                )}
            </div>
        </div>
    );
};