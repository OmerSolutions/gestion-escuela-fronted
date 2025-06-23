import React from 'react';
import { institucionService } from './services/institucion.service';
import { useApi } from './hooks/useApi';
import { InstitucionDto } from './types/institucion.types';
import { useAuth } from './AuthContext';
import { Loading } from './Loading';
import { RolUsuario } from './types';
import { useNotification } from './NotificationContext';
import { ErrorMessage } from './ErrorMessage';
import { InstitucionForm } from './InstitucionForm';

export const InstitucionesPage: React.FC = () => {
  const { user } = useAuth();
  const { data: instituciones, loading, error, refetch } = useApi<InstitucionDto[]>(() => institucionService.obtenerTodos());
  const { showError, showSuccess } = useNotification();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<InstitucionDto | null>(null);
  const [loadingCrud, setLoadingCrud] = React.useState(false);

  if (!user) return <Loading message="Cargando usuario..." />;
  if (user.rol !== RolUsuario.ADMIN) {
    showError('Acceso denegado', 'Solo administradores pueden ver esta página.');
    return <div className="p-6 text-red-600">Acceso denegado. Solo administradores pueden ver esta página.</div>;
  }
  if (loading) return <Loading message="Cargando instituciones..." />;
  if (error) {
    showError('Error al cargar instituciones', error);
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Crear o actualizar institución
  const handleSave = async (data: Partial<InstitucionDto>) => {
    setLoadingCrud(true);
    try {
      if (editData) {
        await institucionService.actualizar(editData.id, data as InstitucionDto);
        showSuccess('Institución actualizada', 'La institución se actualizó correctamente.');
      } else {
        await institucionService.crear(data as InstitucionDto);
        showSuccess('Institución creada', 'La institución se creó correctamente.');
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

  // Eliminar institución
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta institución?')) return;
    setLoadingCrud(true);
    try {
      await institucionService.eliminar(id);
      showSuccess('Institución eliminada', 'La institución fue eliminada.');
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
        Instituciones
        <button className="btn btn-primary" onClick={() => { setEditData(null); setModalOpen(true); }}>
          + Nueva Institución
        </button>
      </h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Código</th>
            <th className="p-2">Total Usuarios</th>
            <th className="p-2">Total Alumnos</th>
            <th className="p-2">Total Cursos</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instituciones?.map(i => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.id}</td>
              <td className="p-2">{i.nombre}</td>
              <td className="p-2">{i.codigo}</td>
              <td className="p-2">{i.totalUsuarios ?? '-'}</td>
              <td className="p-2">{i.totalAlumnos ?? '-'}</td>
              <td className="p-2">{i.totalCursos ?? '-'}</td>
              <td className="p-2 flex gap-2">
                <button className="btn btn-sm btn-warning" onClick={() => { setEditData(i); setModalOpen(true); }}>Editar</button>
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(i.id)} disabled={loadingCrud}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal para crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editData ? 'Editar Institución' : 'Nueva Institución'}</h2>
            <InstitucionForm
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
