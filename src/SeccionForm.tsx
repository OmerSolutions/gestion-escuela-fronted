import React, { useState } from 'react';
import { SeccionDto } from './types/seccion.types';
import { useNotification } from './NotificationContext';

interface SeccionFormProps {
  initialData?: Partial<SeccionDto>;
  onSubmit: (data: Partial<SeccionDto>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const SeccionForm: React.FC<SeccionFormProps> = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [cursoId, setCursoId] = useState(initialData.cursoId || '');
  const [profesorId, setProfesorId] = useState(initialData.profesorId || '');
  const [institucionId, setInstitucionId] = useState(initialData.institucionId || '');
  const { showError } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cursoId || !profesorId || !institucionId) {
      showError('Campos obligatorios', 'Todos los campos son obligatorios');
      return;
    }
    onSubmit({ nombre, cursoId: Number(cursoId), profesorId: Number(profesorId), institucionId: Number(institucionId) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Curso ID</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={cursoId} onChange={e => setCursoId(e.target.value)} required type="number" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Profesor ID</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={profesorId} onChange={e => setProfesorId(e.target.value)} required type="number" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Institución ID</label>
        <input className="input input-bordered w-full px-3 py-2 rounded-lg" value={institucionId} onChange={e => setInstitucionId(e.target.value)} required type="number" />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
};
