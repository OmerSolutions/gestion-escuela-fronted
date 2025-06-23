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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
        Usuarios
        <button className="btn btn-primary" onClick={() => { setEditData(null); setModalOpen(true); }}>
          + Nuevo Usuario
        </button>
      </h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios?.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.nombre} {u.apellido}</td>
              <td className="p-2">{u.correo}</td>
              <td className="p-2">{RolUsuario[u.rol]}</td>
              <td className="p-2 flex gap-2">
                <button className="btn btn-sm btn-warning" onClick={() => { setEditData(u); setModalOpen(true); }}>Editar</button>
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(u.id!)} disabled={loadingCrud}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal para crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editData ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
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
