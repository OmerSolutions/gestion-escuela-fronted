import React from 'react';
import { materialService } from './services/material.service';
import { useApi } from './hooks/useApi';
import { MaterialDto } from './types/material.types';
import { useAuth } from './AuthContext';
import { Loading } from './Loading';
import { RolUsuario } from './types';
import { useNotification } from './NotificationContext';
import { ErrorMessage } from './ErrorMessage';
import { MaterialForm } from './MaterialForm';

export const MaterialesPage: React.FC = () => {
  const { user } = useAuth();
  // Profesores ven todos, alumnos solo los suyos
  const fetchMateriales = () => {
    if (!user) return Promise.resolve([]);
    if (user.rol === RolUsuario.PROFESOR || user.rol === RolUsuario.ADMIN) {
      return materialService.obtenerTodos();
    }
    return materialService.obtenerPorAlumno(user.id!);
  };
  const { data: materiales, loading, error, refetch } = useApi<MaterialDto[]>(fetchMateriales);
  const { showError, showSuccess } = useNotification();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<MaterialDto | null>(null);
  const [loadingCrud, setLoadingCrud] = React.useState(false);

  if (!user) return <Loading message="Cargando usuario..." />;
  if (loading) return <Loading message="Cargando materiales..." />;
  if (error) {
    showError('Error al cargar materiales', error);
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Solo profesores y admin pueden crear/editar/eliminar
  const canEdit = user.rol === RolUsuario.PROFESOR || user.rol === RolUsuario.ADMIN;

  // Crear o actualizar material
  const handleSave = async (data: Partial<MaterialDto>) => {
    setLoadingCrud(true);
    try {
      if (editData) {
        await materialService.actualizar(editData.id, data);
        showSuccess('Material actualizado', 'El material se actualizó correctamente.');
      } else {
        await materialService.crear(data);
        showSuccess('Material creado', 'El material se creó correctamente.');
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

  // Eliminar material
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este material?')) return;
    setLoadingCrud(true);
    try {
      await materialService.eliminar(id);
      showSuccess('Material eliminado', 'El material fue eliminado.');
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
        Materiales
        {canEdit && (
          <button className="btn btn-primary" onClick={() => { setEditData(null); setModalOpen(true); }}>
            + Nuevo Material
          </button>
        )}
      </h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Título</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Archivo</th>
            <th className="p-2">Sección</th>
            <th className="p-2">Subido por</th>
            {canEdit && <th className="p-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {materiales?.map(m => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.id}</td>
              <td className="p-2">{m.titulo}</td>
              <td className="p-2">{m.descripcion}</td>
              <td className="p-2"><a href={m.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver archivo</a></td>
              <td className="p-2">{m.seccionNombre}</td>
              <td className="p-2">{m.uploadedByNombre}</td>
              {canEdit && (
                <td className="p-2 flex gap-2">
                  <button className="btn btn-sm btn-warning" onClick={() => { setEditData(m); setModalOpen(true); }}>Editar</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(m.id)} disabled={loadingCrud}>Eliminar</button>
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
            <h2 className="text-xl font-bold mb-4">{editData ? 'Editar Material' : 'Nuevo Material'}</h2>
            <MaterialForm
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
