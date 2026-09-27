import { useState } from 'react';
import { addCheckIn } from '../services/db';
import { X, Clock, Activity } from 'lucide-react';

export default function CheckInForm({ user, onSuccess, onCancel }) {
  const [attended, setAttended] = useState(true);
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState('');
  const [intensity, setIntensity] = useState('normal');
  const [currentWeight, setCurrentWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const confirmMessage = attended 
      ? "¿Confirmas que realizaste tu entrenamiento hoy en el horario indicado?"
      : "¿Confirmas que NO realizaste tu entrenamiento hoy?";
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    const weightVal = currentWeight ? parseFloat(currentWeight) : null;
    const result = await addCheckIn(user.uid, attended, notes, user.email, time, intensity, weightVal);
    
    setIsSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError('Error al guardar el registro. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-foreground">Tu Entrenamiento</h3>
        <button onClick={onCancel} className="p-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-500 rounded-lg bg-red-500/10 border border-red-500/20 font-bold" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-6 flex-1 overflow-y-auto pr-2 pb-6">
          
          <div className="bg-foreground/5 p-4 rounded-2xl border border-border shadow-sm">
            <label className="block text-sm font-bold text-foreground/80 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-accent" /> Duración (minutos)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 90].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t.toString())}
                  className={`py-3 rounded-xl font-bold transition-all border-2 ${time === t.toString() ? 'border-accent bg-accent/20 text-accent shadow-sm' : 'border-transparent bg-background text-foreground/80 hover:bg-foreground/10'}`}
                >
                  {t}'
                </button>
              ))}
            </div>
            <input 
              type="number"
              placeholder="Otro tiempo..."
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-3 w-full bg-background border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
          </div>

          <div className="bg-foreground/5 p-4 rounded-2xl border border-border shadow-sm">
            <label className="block text-sm font-bold text-foreground/80 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-accent" /> Intensidad
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['suave', 'normal', 'fuerte', 'extremo'].map(level => {
                const colors = {
                  suave: 'border-green-500 text-green-500 bg-green-500/20',
                  normal: 'border-blue-500 text-blue-500 bg-blue-500/20',
                  fuerte: 'border-orange-500 text-orange-500 bg-orange-500/20',
                  extremo: 'border-red-500 text-red-500 bg-red-500/20',
                };
                const isSelected = intensity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setIntensity(level)}
                    className={`py-3 px-2 rounded-xl font-bold capitalize transition-all border-2 ${isSelected ? `${colors[level]} shadow-md` : 'border-transparent bg-background text-foreground/80 hover:bg-foreground/10'}`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-2xl border border-border shadow-sm">
            <label className="block text-sm font-bold text-foreground/80 mb-2 flex items-center gap-2">
              <Activity size={16} className="text-accent" /> Peso Corporal (opcional)
            </label>
            <input 
              type="number" 
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="Ej: 71.5 kg"
            />
            <p className="text-xs text-foreground/50 mt-2 font-medium">Registra tu peso para ver tu progreso en las gráficas.</p>
          </div>

          <div className="bg-foreground/5 p-4 rounded-2xl border border-border shadow-sm">
            <label className="block text-sm font-bold text-foreground/80 mb-2">Notas del entrenamiento</label>
            <textarea 
              className="w-full bg-background border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all min-h-[100px] resize-none"
              placeholder="Ej: Subí 5kg en Sentadilla..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-6 w-full btn-accent font-bold py-4 rounded-2xl shadow-lg flex justify-center items-center"
        >
          {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Guardar Entrenamiento'}
        </button>
      </form>
    </div>
  );
}
