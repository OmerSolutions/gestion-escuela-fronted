import React from 'react';
import { materialService } from '../services/material.service';
import { useApi } from '../hooks/useApi';
import { MaterialDto } from '../types/material.types';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import { RolUsuario } from '../types';
import { useNotification } from '../components/NotificationContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { MaterialForm } from '../forms/MaterialForm';

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
    <div className="p-2 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        Materiales
        {canEdit && (
          <button className="btn btn-primary w-full sm:w-auto" onClick={() => { setEditData(null); setModalOpen(true); }}>
            + Nuevo Material
          </button>
        )}
      </h1>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 whitespace-nowrap">ID</th>
              <th className="p-2 whitespace-nowrap">Título</th>
              <th className="p-2 whitespace-nowrap">Descripción</th>
              <th className="p-2 whitespace-nowrap">Archivo</th>
              <th className="p-2 whitespace-nowrap">Fecha</th>
              <th className="p-2 whitespace-nowrap">Sección</th>
              <th className="p-2 whitespace-nowrap">Subido por</th>
              <th className="p-2 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiales?.map(m => (
              <tr key={m.id} className="border-t">
                <td className="p-2 whitespace-nowrap">{m.id}</td>
                <td className="p-2 whitespace-nowrap">{m.titulo}</td>
                <td className="p-2 whitespace-nowrap">{m.descripcion ?? '-'}</td>
                <td className="p-2 whitespace-nowrap"><a href={m.filePath} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Ver archivo</a></td>
                <td className="p-2 whitespace-nowrap">{m.fechaSubida}</td>
                <td className="p-2 whitespace-nowrap">{m.seccionNombre ?? '-'}</td>
                <td className="p-2 whitespace-nowrap">{m.uploadedByNombre ?? '-'}</td>
                <td className="p-2 flex flex-col sm:flex-row gap-2">
                  {canEdit && <>
                    <button className="btn btn-sm btn-warning w-full sm:w-auto" onClick={() => { setEditData(m); setModalOpen(true); }}>Editar</button>
                    <button className="btn btn-sm btn-error w-full sm:w-auto" onClick={() => handleDelete(m.id)} disabled={loadingCrud}>Eliminar</button>
                  </>}
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
            <h2 className="text-lg sm:text-xl font-bold mb-4">{editData ? 'Editar Material' : 'Nuevo Material'}</h2>
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
