import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';


import {ROUTES} from '@utils/constants';
import {formatters} from '@utils/formatters';
import {useAuth} from "@/AuthContext.tsx";
import {useNotification} from "@/NotificationContext.tsx";
import {Loading} from "@/Loading.tsx";
import {alumnoService} from "@/services/alumno.service";
import {asistenciaService} from "@/services/asistencia.service";
import {materialService} from "@/services/material.service";
import {useApi} from "@/hooks/useApi";
import {AsistenciaDto} from "@/types/asistencia.types";
import {MaterialDto} from "@/types/material.types";

interface AlumnoStats {
    asistenciasPresente: number;
    asistenciasAusente: number;
    materialesDisponibles: number;
    proximasClases: number;
}

export const AlumnoDashboard: React.FC = () => {
    const { user } = useAuth();
    const { showError } = useNotification();

    // Si no hay usuario, mostrar loading (o podrías redirigir a login si tu lógica lo requiere)
    if (!user) {
        return <Loading message="Cargando usuario..." />;
    }

    // Llamadas a servicios usando useApi
    const {
        data: alumno,
        loading: loadingAlumno,
        error: errorAlumno
    } = useApi(() => user?.dni ? alumnoService.obtenerPorId(user.dni) : Promise.resolve(undefined), { immediate: !!user?.dni });

    const {
        data: asistencias = [],
        loading: loadingAsistencias,
        error: errorAsistencias
    } = useApi<AsistenciaDto[]>(() => user?.dni ? asistenciaService.obtenerPorAlumno(user.dni) : Promise.resolve([]), { immediate: !!user?.dni });

    const {
        data: materiales = [],
        loading: loadingMateriales,
        error: errorMateriales
    } = useApi<MaterialDto[]>(() => user?.id ? materialService.obtenerPorAlumno(user.id) : Promise.resolve([]), { immediate: !!user?.id });

    // Calcular estadísticas reales
    const stats: AlumnoStats = {
        asistenciasPresente: (asistencias ?? []).filter(a => a.estado === 'Presente').length,
        asistenciasAusente: (asistencias ?? []).filter(a => a.estado === 'Ausente').length,
        materialesDisponibles: (materiales ?? []).length,
        proximasClases: 0 // Puedes implementar lógica real si tienes endpoint
    };

    const loading = loadingAlumno || loadingAsistencias || loadingMateriales;

    if (loading) {
        return <Loading message="Cargando dashboard..." />;
    }

    return (
        <div className="p-2 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Panel del Alumno</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-primary-light rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-primary-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.asistenciasPresente}</div>
                        <div className="text-xs text-gray-700">Asistencias</div>
                    </div>
                </div>
                <div className="bg-red-100 rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-error-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.asistenciasAusente}</div>
                        <div className="text-xs text-gray-700">Ausencias</div>
                    </div>
                </div>
                <div className="bg-blue-100 rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-info-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H9a1 1 0 00-1 1v9m0 0l4 4 4-4" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.materialesDisponibles}</div>
                        <div className="text-xs text-gray-700">Materiales</div>
                    </div>
                </div>
                <div className="bg-yellow-100 rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="bg-warning-color text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
                    </div>
                    <div>
                        <div className="text-lg font-bold">{stats.proximasClases}</div>
                        <div className="text-xs text-gray-700">Próximas clases</div>
                    </div>
                </div>
            </div>
        </div>
    );
};