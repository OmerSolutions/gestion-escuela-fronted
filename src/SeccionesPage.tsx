import React from 'react';
import { seccionService } from './services/seccion.service';
import { useApi } from './hooks/useApi';
import { SeccionDto } from './types/seccion.types';
import { useAuth } from './AuthContext';
import { Loading } from './Loading';
import { RolUsuario } from './types';
import { useNotification } from './NotificationContext';
import { ErrorMessage } from './ErrorMessage';
import { SeccionForm } from './SeccionForm';

export const SeccionesPage: React.FC = () => {
  const { user } = useAuth();
  const { data: secciones, loading, error, refetch } = useApi<SeccionDto[]>(() => seccionService.obtenerTodos());
  const { showError, showSuccess } = useNotification();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<SeccionDto | null>(null);
  const [loadingCrud, setLoadingCrud] = React.useState(false);

  if (!user) {
    return <Loading message="Cargando usuario..." />;
  }

  if (user.rol !== RolUsuario.ADMIN && user.rol !== RolUsuario.PROFESOR) {
    showError('Acceso denegado', 'Solo administradores y profesores pueden ver esta página.');
    return <div className="p-6 text-red-600">Acceso denegado. Solo administradores y profesores pueden ver esta página.</div>;
  }

  if (loading) return <Loading message="Cargando secciones..." />;
  if (error) {
    showError('Error al cargar secciones', error);
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Crear o actualizar sección
  const handleSave = async (data: Partial<SeccionDto>) => {
    setLoadingCrud(true);
    try {
      if (editData) {
        await seccionService.actualizar(editData.id, data as SeccionDto);
        showSuccess('Sección actualizada', 'La sección se actualizó correctamente.');
      } else {
        await seccionService.crear(data as SeccionDto);
        showSuccess('Sección creada', 'La sección se creó correctamente.');
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

  // Eliminar sección
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta sección?')) return;
    setLoadingCrud(true);
    try {
      await seccionService.eliminar(id);
      showSuccess('Sección eliminada', 'La sección fue eliminada.');
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
        Secciones
        {user.rol === RolUsuario.ADMIN && (
          <button className="btn btn-primary" onClick={() => { setEditData(null); setModalOpen(true); }}>
            + Nueva Sección
          </button>
        )}
      </h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Curso</th>
            <th className="p-2">Profesor</th>
            <th className="p-2">Institución</th>
            <th className="p-2">Total Horarios</th>
            <th className="p-2">Total Materiales</th>
            {user.rol === RolUsuario.ADMIN && <th className="p-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {secciones?.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.id}</td>
              <td className="p-2">{s.nombre}</td>
              <td className="p-2">{s.cursoNombre}</td>
              <td className="p-2">{s.profesorNombre}</td>
              <td className="p-2">{s.institucionNombre}</td>
              <td className="p-2">{s.totalHorarios ?? '-'}</td>
              <td className="p-2">{s.totalMateriales ?? '-'}</td>
              {user.rol === RolUsuario.ADMIN && (
                <td className="p-2 flex gap-2">
                  <button className="btn btn-sm btn-warning" onClick={() => { setEditData(s); setModalOpen(true); }}>Editar</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(s.id)} disabled={loadingCrud}>Eliminar</button>
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
            <h2 className="text-xl font-bold mb-4">{editData ? 'Editar Sección' : 'Nueva Sección'}</h2>
            <SeccionForm
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
