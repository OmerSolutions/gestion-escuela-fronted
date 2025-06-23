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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
        Alumnos
        {user.rol === 2 && (
          <button className="btn btn-primary" onClick={() => { setEditData(null); setModalOpen(true); }}>
            + Nuevo Alumno
          </button>
        )}
      </h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">DNI</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Institución</th>
            {user.rol === 2 && <th className="p-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {alumnos?.map(a => (
            <tr key={a.dni} className="border-t">
              <td className="p-2">{a.dni}</td>
              <td className="p-2">{a.nombre} {a.apellido}</td>
              <td className="p-2">{a.correo}</td>
              <td className="p-2">{a.institucionNombre}</td>
              {user.rol === 2 && (
                <td className="p-2 flex gap-2">
                  <button className="btn btn-sm btn-warning" onClick={() => { setEditData(a); setModalOpen(true); }}>Editar</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(a.dni!)} disabled={loadingCrud}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal para crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editData ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
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
