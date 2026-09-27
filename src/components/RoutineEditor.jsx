import { useState, useEffect } from 'react';
import { saveUserProfile } from '../services/db';
import { Edit2, Check, X } from 'lucide-react';

const DAYS = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
  { id: 0, label: 'Domingo' }
];

const DEFAULT_ROUTINE = {
  1: { name: "Entrenamiento", desc: "" },
  2: { name: "Entrenamiento", desc: "" },
  3: { name: "Entrenamiento", desc: "" },
  4: { name: "Entrenamiento", desc: "" },
  5: { name: "Entrenamiento", desc: "" },
  6: { name: "Entrenamiento", desc: "" },
  0: { name: "Descanso", desc: "" }
};

export default function RoutineEditor({ user, profile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [routineData, setRoutineData] = useState(DEFAULT_ROUTINE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.customRoutine) {
      setRoutineData(profile.customRoutine);
    }
  }, [profile?.customRoutine]);

  const handleChange = (dayId, field, value) => {
    setRoutineData(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedProfile = { ...profile, customRoutine: routineData, programId: 'custom' };
    await saveUserProfile(user.uid, updatedProfile);
    onProfileUpdate(updatedProfile);
    setIsEditing(false);
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 sm:p-8 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2">
             Mi Plan Semanal
          </h4>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Personaliza lo que entrenas cada día.
          </p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-xl text-foreground font-semibold transition-colors"
          >
            <Edit2 size={16} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-foreground/5 hover:bg-foreground/10 px-3 py-2 rounded-xl text-foreground font-semibold transition-colors"
            >
              <X size={16} />
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 btn-accent px-4 py-2 rounded-xl font-semibold"
            >
              <Check size={16} /> {loading ? '...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {DAYS.map(day => {
          const dayData = routineData[day.id] || { name: '', desc: '' };
          
          if (!isEditing) {
            return (
              <div key={day.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                <span className="font-bold w-24 text-[var(--text-muted)]">{day.label}</span>
                <div className="flex-1 mt-1 sm:mt-0">
                  <span className="font-bold text-foreground">{dayData.name || 'Descanso'}</span>
                  {dayData.desc && <span className="text-[var(--text-muted)] text-sm ml-2 hidden sm:inline">• {dayData.desc}</span>}
                </div>
                {dayData.desc && <div className="text-[var(--text-muted)] text-sm sm:hidden mt-1">{dayData.desc}</div>}
              </div>
            );
          }

          return (
            <div key={day.id} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 rounded-xl border border-accent/20 bg-accent/5">
              <span className="font-bold w-24 text-[var(--text-muted)] pt-2">{day.label}</span>
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  placeholder="Ej: Push, Pierna, Descanso"
                  value={dayData.name}
                  onChange={(e) => handleChange(day.id, 'name', e.target.value)}
                  className="flex-1 bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-accent/50 outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Detalles (Ej: Pecho y Tríceps)"
                  value={dayData.desc}
                  onChange={(e) => handleChange(day.id, 'desc', e.target.value)}
                  className="flex-[2] bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-accent/50 outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
