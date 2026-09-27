import { useState } from 'react';
import { addCheckIn } from '../services/db';
import { Check, X, Send } from 'lucide-react';

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
      setError('Error al guardar el registro. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Registro Diario</h3>
        <p className="text-slate-500 mt-1">Guarda tu progreso de hoy para mantener la racha.</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
          <X size={18} />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-6 flex-1">
          {/* Custom Checkbox Toggle */}
          <div 
            onClick={() => setAttended(!attended)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 ${
              attended 
                ? 'border-blue-500 bg-blue-50/50 shadow-sm shadow-blue-100' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              attended ? 'bg-blue-600 text-white' : 'bg-slate-100 text-transparent'
            }`}>
              <Check size={18} strokeWidth={3} />
            </div>
            <div>
              <p className={`font-bold text-lg ${attended ? 'text-blue-900' : 'text-slate-600'}`}>
                Sí, fui a entrenar hoy 💪
              </p>
            </div>
          </div>

          {/* Textarea with smooth transition */}
          <div className={`transition-all duration-300 overflow-hidden ${attended ? 'opacity-100 h-auto' : 'opacity-50 h-auto pointer-events-none'}`}>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              ¿Qué ejercicios hiciste? / Notas del día
            </label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none min-h-[140px] text-base"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Pecho plano 4x10, elevaciones laterales 4x12, sentí progreso en tríceps..."
              disabled={!attended}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 bg-white border border-slate-200 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-[2] flex justify-center items-center gap-2 bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-wait shadow-lg shadow-blue-600/20"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              <>
                Guardar Registro
                <Send size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
