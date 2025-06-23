import React from 'react';
import { usuarioService } from './services/usuario.service';
import { useApi } from './hooks/useApi';
import { UsuarioDto } from './types/usuario.types';
import { useAuth } from './AuthContext';
import { Loading } from './Loading';
import { useNotification } from './NotificationContext';
import { ErrorMessage } from './ErrorMessage';
import { UsuarioForm } from './UsuarioForm';
import { RolUsuario } from './types';

export const UsuariosPage: React.FC = () => {
  const { user } = useAuth();
  const { data: usuarios, loading, error, refetch } = useApi<UsuarioDto[]>(() => usuarioService.obtenerTodos());
  const { showError, showSuccess } = useNotification();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<UsuarioDto | null>(null);
  const [loadingCrud, setLoadingCrud] = React.useState(false);

  if (!user) return <Loading message="Cargando usuario..." />;
  if (user.rol !== RolUsuario.ADMIN) {
    showError('Acceso denegado', 'Solo administradores pueden ver esta página.');
    return <div className="p-6 text-red-600">Acceso denegado. Solo administradores pueden ver esta página.</div>;
  }
  if (loading) return <Loading message="Cargando usuarios..." />;
  if (error) {
    showError('Error al cargar usuarios', error);
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  // Crear o actualizar usuario
  const handleSave = async (data: Partial<UsuarioDto>) => {
    setLoadingCrud(true);
    try {
      if (editData) {
        await usuarioService.actualizar(editData.id!, data as UsuarioDto);
        showSuccess('Usuario actualizado', 'El usuario se actualizó correctamente.');
      } else {
        await usuarioService.crear(data as UsuarioDto);
        showSuccess('Usuario creado', 'El usuario se creó correctamente.');
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

  // Eliminar usuario
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    setLoadingCrud(true);
    try {
      await usuarioService.eliminar(id);
      showSuccess('Usuario eliminado', 'El usuario fue eliminado.');
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
        Usuarios
        <button className="btn btn-primary w-full sm:w-auto" onClick={() => { setEditData(null); setModalOpen(true); }}>
          + Nuevo Usuario
        </button>
      </h1>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 whitespace-nowrap">ID</th>
              <th className="p-2 whitespace-nowrap">Nombre</th>
              <th className="p-2 whitespace-nowrap">Correo</th>
              <th className="p-2 whitespace-nowrap">Rol</th>
              <th className="p-2 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2 whitespace-nowrap">{u.id}</td>
                <td className="p-2 whitespace-nowrap">{u.nombre}</td>
                <td className="p-2 whitespace-nowrap">{u.correo}</td>
                <td className="p-2 whitespace-nowrap">{u.rol}</td>
                <td className="p-2 flex flex-col sm:flex-row gap-2">
                  <button className="btn btn-sm btn-warning w-full sm:w-auto" onClick={() => { setEditData(u); setModalOpen(true); }}>Editar</button>
                  <button className="btn btn-sm btn-error w-full sm:w-auto" onClick={() => handleDelete(u.id!)} disabled={loadingCrud}>Eliminar</button>
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
            <h2 className="text-lg sm:text-xl font-bold mb-4">{editData ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <UsuarioForm
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
