import React from 'react';
import { alumnoService } from './services/alumno.service';
import { useApi } from './hooks/useApi';
import { AlumnoDto } from './types/alumno.types';
import { useAuth } from './AuthContext';
import { Loading } from './Loading';
import { useNotification } from './NotificationContext';
import { ErrorMessage } from './ErrorMessage';
import { AlumnoForm } from './AlumnoForm';

export const AlumnosPage: React.FC = () => {
  const { user } = useAuth();
  const { data: alumnos, loading, error, refetch } = useApi<AlumnoDto[]>(() => alumnoService.obtenerTodos());
  const { showError, showSuccess } = useNotification();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<AlumnoDto | null>(null);
  const [loadingCrud, setLoadingCrud] = React.useState(false);

  if (!user) return <Loading message="Cargando usuario..." />;
  if (user.rol !== 2 && user.rol !== 1) {
    showError('Acceso denegado', 'Solo administradores y profesores pueden ver esta página.');
    return <div className="p-6 text-red-600">Acceso denegado. Solo administradores y profesores pueden ver esta página.</div>;
  }
  if (loading) return <Loading message="Cargando alumnos..." />;
  if (error) {
    showError('Error al cargar alumnos', error);
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Crear o actualizar alumno
  const handleSave = async (data: Partial<AlumnoDto>) => {
    setLoadingCrud(true);
    try {
      if (editData) {
        await alumnoService.actualizar(editData.dni!, data as AlumnoDto);
        showSuccess('Alumno actualizado', 'El alumno se actualizó correctamente.');
      } else {
        await alumnoService.crear(data as AlumnoDto);
        showSuccess('Alumno creado', 'El alumno se creó correctamente.');
      }
      setModalOpen(false);
      setEditData(null);
      refetch();
    } catch (e: any) {
      showError('Error al guardar', e.message || 'Error desconocido');
    } finally {
      setLoadingCrud(false);
    }
  };

  // Eliminar alumno
  const handleDelete = async (dni: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este alumno?')) return;
    setLoadingCrud(true);
    try {
      await alumnoService.eliminar(dni);
      showSuccess('Alumno eliminado', 'El alumno fue eliminado.');
      refetch();
    } catch (e: any) {
      showError('Error al eliminar', e.message || 'Error desconocido');
    } finally {
      setLoadingCrud(false);
    }
  };

  return (
    <div className="p-2 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        Alumnos
        {user.rol === 2 && (
          <button className="btn btn-primary w-full sm:w-auto" onClick={() => { setEditData(null); setModalOpen(true); }}>
            + Nuevo Alumno
          </button>
        )}
      </h1>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 whitespace-nowrap">DNI</th>
              <th className="p-2 whitespace-nowrap">Nombre</th>
              <th className="p-2 whitespace-nowrap">Correo</th>
              <th className="p-2 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos?.map(a => (
              <tr key={a.dni} className="border-t">
                <td className="p-2 whitespace-nowrap">{a.dni}</td>
                <td className="p-2 whitespace-nowrap">{a.nombre}</td>
                <td className="p-2 whitespace-nowrap">{a.correo}</td>
                <td className="p-2 flex flex-col sm:flex-row gap-2">
                  <button className="btn btn-sm btn-warning w-full sm:w-auto" onClick={() => { setEditData(a); setModalOpen(true); }}>Editar</button>
                  <button className="btn btn-sm btn-error w-full sm:w-auto" onClick={() => handleDelete(a.dni!)} disabled={loadingCrud}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal para crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">{editData ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
            <AlumnoForm
              initialData={editData || undefined}
              onSubmit={handleSave}
              onCancel={() => { setModalOpen(false); setEditData(null); }}
              loading={loadingCrud}
            />
          </div>
        </div>
      )}
    </div>
  );
};
