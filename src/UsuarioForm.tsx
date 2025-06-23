import React, { useState } from 'react';
import { UsuarioDto } from './types/usuario.types';
import { RolUsuario } from './types';

interface UsuarioFormProps {
  initialData?: Partial<UsuarioDto>;
  onSubmit: (data: Partial<UsuarioDto>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [apellido, setApellido] = useState(initialData.apellido || '');
  const [correo, setCorreo] = useState(initialData.correo || '');
  const [rol, setRol] = useState(initialData.rol ?? RolUsuario.ALUMNO);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !correo) return;
    onSubmit({ nombre, apellido, correo, rol });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input className="input input-bordered w-full" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Apellido</label>
        <input className="input input-bordered w-full" value={apellido} onChange={e => setApellido(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Correo</label>
        <input className="input input-bordered w-full" value={correo} onChange={e => setCorreo(e.target.value)} required type="email" />
      </div>
      <div>
        <label className="block text-sm font-medium">Rol</label>
        <select className="input input-bordered w-full" value={rol} onChange={e => setRol(Number(e.target.value))} required>
          <option value={RolUsuario.ALUMNO}>Alumno</option>
          <option value={RolUsuario.PROFESOR}>Profesor</option>
          <option value={RolUsuario.ADMIN}>Administrador</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
};
