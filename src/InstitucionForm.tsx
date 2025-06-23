import React, { useState } from 'react';
import { InstitucionDto } from './types/institucion.types';

interface InstitucionFormProps {
  initialData?: Partial<InstitucionDto>;
  onSubmit: (data: Partial<InstitucionDto>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const InstitucionForm: React.FC<InstitucionFormProps> = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [codigo, setCodigo] = useState(initialData.codigo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !codigo) return;
    onSubmit({ nombre, codigo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input className="input input-bordered w-full" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Código</label>
        <input className="input input-bordered w-full" value={codigo} onChange={e => setCodigo(e.target.value)} required />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
};
