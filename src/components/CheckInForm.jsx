import { useState } from 'react';
import { addCheckIn } from '../services/db';

export default function CheckInForm({ user, onSuccess, onCancel }) {
  const [attended, setAttended] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await addCheckIn(user.uid, attended, notes, user.email);
    
    setIsSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError('Error al guardar. Intenta de nuevo.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Registro del Día</h3>
      {error && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
          <input 
            type="checkbox" 
            checked={attended}
            onChange={(e) => setAttended(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="font-medium text-gray-700">¿Fuiste al gimnasio hoy?</span>
        </label>

        {attended && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿Qué ejercicios hiciste? / Notas del entrenamiento
            </label>
            <textarea 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Pecho plano 4x10, elevaciones laterales..."
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 p-2.5 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white p-2.5 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
