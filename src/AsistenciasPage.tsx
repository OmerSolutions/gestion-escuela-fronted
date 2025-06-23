import React, { useState } from 'react';
import { asistenciaService } from './services/asistencia.service';
import { useApi } from './hooks/useApi';
import { AsistenciaDto, ReporteAsistenciaDto } from './types/asistencia.types';
import { useAuth } from './AuthContext';
import { Loading } from './Loading';
import { RolUsuario } from './types';
import { useNotification } from './NotificationContext';
import { ErrorMessage } from './ErrorMessage';

export const AsistenciasPage: React.FC = () => {
  const { user } = useAuth();
  const [filtros, setFiltros] = useState({ alumnoDni: '', seccionId: '', fechaInicio: '', fechaFin: '' });
  const [showReport, setShowReport] = useState(false);
  const { showError } = useNotification();

  // Fetch asistencias o reporte según filtro y rol
  const fetchAsistencias = () => {
    if (!user) return Promise.resolve([]);
    if (showReport && (user.rol === RolUsuario.ADMIN || user.rol === RolUsuario.PROFESOR)) {
      return asistenciaService.reporte({
        alumnoDni: filtros.alumnoDni || undefined,
        seccionId: filtros.seccionId ? Number(filtros.seccionId) : undefined,
        fechaInicio: filtros.fechaInicio || undefined,
        fechaFin: filtros.fechaFin || undefined,
      });
    }
    if (user.rol === RolUsuario.ADMIN || user.rol === RolUsuario.PROFESOR) {
      return asistenciaService.obtenerTodos({
        alumnoDni: filtros.alumnoDni || undefined,
        seccionId: filtros.seccionId ? Number(filtros.seccionId) : undefined,
        fechaInicio: filtros.fechaInicio || undefined,
        fechaFin: filtros.fechaFin || undefined,
      });
    }
    return asistenciaService.obtenerPorAlumno(user.dni!);
  };
  const { data, loading, error, refetch } = useApi<any[]>(fetchAsistencias, { immediate: true });

  if (!user) return <Loading message="Cargando usuario..." />;
  if (loading) return <Loading message="Cargando asistencias..." />;
  if (error) {
    showError('Error al cargar asistencias', error);
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Render tabla según si es reporte o lista normal
  const renderTable = () => {
    if (showReport) {
      return (
        <table className="min-w-full bg-white rounded shadow mt-4">
          <thead>
            <tr>
              <th className="p-2">Alumno</th>
              <th className="p-2">Sección</th>
              <th className="p-2">Total Clases</th>
              <th className="p-2">Presentes</th>
              <th className="p-2">Ausentes</th>
              <th className="p-2">Tardes</th>
              <th className="p-2">Justificados</th>
              <th className="p-2">% Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((r: ReporteAsistenciaDto, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{r.alumnoNombre} ({r.alumnoDni})</td>
                <td className="p-2">{r.seccionNombre || '-'}</td>
                <td className="p-2">{r.totalClases}</td>
                <td className="p-2">{r.totalPresentes}</td>
                <td className="p-2">{r.totalAusentes}</td>
                <td className="p-2">{r.totalTardes}</td>
                <td className="p-2">{r.totalJustificados}</td>
                <td className="p-2">{r.porcentajeAsistencia}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      <table className="min-w-full bg-white rounded shadow mt-4">
        <thead>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Alumno</th>
            <th className="p-2">Sección</th>
            <th className="p-2">Curso</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((a: AsistenciaDto) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{a.id}</td>
              <td className="p-2">{a.fecha}</td>
              <td className="p-2">{a.estado}</td>
              <td className="p-2">{a.alumnoNombre || a.alumnoDni}</td>
              <td className="p-2">{a.seccionNombre}</td>
              <td className="p-2">{a.cursoNombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
        Asistencias
        {(user.rol === RolUsuario.ADMIN || user.rol === RolUsuario.PROFESOR) && (
          <button className="btn btn-secondary" onClick={() => setShowReport(r => !r)}>
            {showReport ? 'Ver Lista' : 'Ver Reporte'}
          </button>
        )}
      </h1>
      {/* Filtros */}
      {(user.rol === RolUsuario.ADMIN || user.rol === RolUsuario.PROFESOR) && (
        <form className="flex flex-wrap gap-2 mb-4" onSubmit={e => { e.preventDefault(); refetch(); }}>
          <input className="input input-bordered" placeholder="DNI Alumno" value={filtros.alumnoDni} onChange={e => setFiltros(f => ({ ...f, alumnoDni: e.target.value }))} />
          <input className="input input-bordered" placeholder="ID Sección" value={filtros.seccionId} onChange={e => setFiltros(f => ({ ...f, seccionId: e.target.value }))} />
          <input className="input input-bordered" type="date" value={filtros.fechaInicio} onChange={e => setFiltros(f => ({ ...f, fechaInicio: e.target.value }))} />
          <input className="input input-bordered" type="date" value={filtros.fechaFin} onChange={e => setFiltros(f => ({ ...f, fechaFin: e.target.value }))} />
          <button className="btn btn-primary" type="submit">Filtrar</button>
        </form>
      )}
      {renderTable()}
    </div>
  );
};
