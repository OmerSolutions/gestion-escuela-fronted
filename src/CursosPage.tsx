import React from 'react';
import { cursoService } from './services/curso.service';
import { useApi } from './hooks/useApi';
import { CursoDto } from './types/curso.types';
import { useAuth } from './AuthContext';
import { Loading } from './Loading';
import { useNotification } from './NotificationContext';
import { ErrorMessage } from './ErrorMessage';
import { CursoForm } from './CursoForm';

export const CursosPage: React.FC = () => {
  const { user } = useAuth();
  const { data: cursos, loading, error, refetch } = useApi<CursoDto[]>(() => cursoService.obtenerTodos());
  const { showError, showSuccess } = useNotification();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<CursoDto | null>(null);
  const [loadingCrud, setLoadingCrud] = React.useState(false);

  if (!user) return <Loading message="Cargando usuario..." />;
  if (user.rol !== 2 && user.rol !== 1) {
    showError('Acceso denegado', 'Solo administradores y profesores pueden ver esta página.');
    return <div className="p-6 text-red-600">Acceso denegado. Solo administradores y profesores pueden ver esta página.</div>;
  }
  if (loading) return <Loading message="Cargando cursos..." />;
  if (error) {
    showError('Error al cargar cursos', error);
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Crear o actualizar curso
  const handleSave = async (data: Partial<CursoDto>) => {
    setLoadingCrud(true);
    try {
      if (editData) {
        await cursoService.actualizar(editData.id, data as CursoDto);
        showSuccess('Curso actualizado', 'El curso se actualizó correctamente.');
      } else {
        await cursoService.crear(data as CursoDto);
        showSuccess('Curso creado', 'El curso se creó correctamente.');
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

  // Eliminar curso
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este curso?')) return;
    setLoadingCrud(true);
    try {
      await cursoService.eliminar(id);
      showSuccess('Curso eliminado', 'El curso fue eliminado.');
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
        Cursos
        {user.rol === 2 && (
          <button className="btn btn-primary w-full sm:w-auto" onClick={() => { setEditData(null); setModalOpen(true); }}>
            + Nuevo Curso
          </button>
        )}
      </h1>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 whitespace-nowrap">ID</th>
              <th className="p-2 whitespace-nowrap">Nombre</th>
              <th className="p-2 whitespace-nowrap">Código Interno</th>
              <th className="p-2 whitespace-nowrap">Institución</th>
              <th className="p-2 whitespace-nowrap">Total Secciones</th>
              <th className="p-2 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos?.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2 whitespace-nowrap">{c.id}</td>
                <td className="p-2 whitespace-nowrap">{c.nombre}</td>
                <td className="p-2 whitespace-nowrap">{c.codigoInterno}</td>
                <td className="p-2 whitespace-nowrap">{c.institucionNombre ?? '-'}</td>
                <td className="p-2 whitespace-nowrap">{c.totalSecciones ?? '-'}</td>
                <td className="p-2 flex flex-col sm:flex-row gap-2">
                  <button className="btn btn-sm btn-warning w-full sm:w-auto" onClick={() => { setEditData(c); setModalOpen(true); }}>Editar</button>
                  <button className="btn btn-sm btn-error w-full sm:w-auto" onClick={() => handleDelete(c.id)} disabled={loadingCrud}>Eliminar</button>
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
            <h2 className="text-lg sm:text-xl font-bold mb-4">{editData ? 'Editar Curso' : 'Nuevo Curso'}</h2>
            <CursoForm
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
