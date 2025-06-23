import React, { useState } from 'react';
import { MaterialDto } from './types/material.types';

interface MaterialFormProps {
  initialData?: Partial<MaterialDto>;
  onSubmit: (data: Partial<MaterialDto>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [titulo, setTitulo] = useState(initialData.titulo || '');
  const [descripcion, setDescripcion] = useState(initialData.descripcion || '');
  const [filePath, setFilePath] = useState(initialData.filePath || '');
  const [seccionId, setSeccionId] = useState(initialData.seccionId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !filePath || !seccionId) return;
    onSubmit({ titulo, descripcion, filePath, seccionId: Number(seccionId) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={titulo} onChange={e => setTitulo(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Archivo (URL o ruta)</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={filePath} onChange={e => setFilePath(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sección ID</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={seccionId} onChange={e => setSeccionId(e.target.value)} required type="number" />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
};
