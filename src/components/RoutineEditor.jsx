import { useState, useEffect } from 'react';
import { saveUserProfile } from '../services/db';
import { Edit2, Check, X, BookOpen } from 'lucide-react';
import { PROGRAM_TYPES, ROUTINES } from '../data/routines';

const DAYS = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
  { id: 0, label: 'Domingo' }
];

export default function RoutineEditor({ user, profile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('ppl');
  const [routineData, setRoutineData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pId = profile?.programId || 'ppl';
    setSelectedProgram(pId);
    
    if (profile?.customRoutine) {
      setRoutineData(profile.customRoutine);
    } else {
      setRoutineData(ROUTINES[pId] || ROUTINES.default);
    }
  }, [profile]);

  const handleProgramChange = (e) => {
    const newProgramId = e.target.value;
    setSelectedProgram(newProgramId);
    if (newProgramId !== 'custom') {
      // Al cambiar la base, precargamos los días con esa rutina
      setRoutineData(ROUTINES[newProgramId] || ROUTINES.default);
    }
  };

  const handleChange = (dayId, field, value) => {
    setRoutineData(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }));
    // Si modifican manualmente los días de un programa base, lo marcamos como "custom"
    if (selectedProgram !== 'custom') {
      setSelectedProgram('custom');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedProfile = { 
      ...profile, 
      customRoutine: routineData, 
      programId: selectedProgram 
    };
    await saveUserProfile(user.uid, updatedProfile);
    onProfileUpdate(updatedProfile);
    setIsEditing(false);
    setLoading(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Revertir a lo que hay en el perfil
    const pId = profile?.programId || 'ppl';
    setSelectedProgram(pId);
    setRoutineData(profile?.customRoutine || ROUTINES[pId] || ROUTINES.default);
  };

  return (
    <div className="glass-card p-6 sm:p-8 mt-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 text-foreground">
             <BookOpen className="text-accent" /> Mi Plan Semanal
          </h4>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {isEditing ? "Elige una base o personaliza día por día." : "Tu rutina actual detallada."}
          </p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-xl text-foreground font-semibold transition-colors self-start sm:self-auto"
          >
            <Edit2 size={16} /> Editar
          </button>
        ) : (
          <div className="flex gap-2 self-start sm:self-auto">
            <button 
              onClick={cancelEdit}
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

      {isEditing && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-foreground/5 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="font-bold text-foreground whitespace-nowrap">Programa Base:</label>
          <select 
            value={selectedProgram}
            onChange={handleProgramChange}
            className="flex-1 bg-background border border-border rounded-lg p-2.5 text-sm font-semibold text-foreground focus:ring-2 focus:ring-accent/50 outline-none"
          >
            <option value="custom">-- Personalizado --</option>
            {Object.entries(PROGRAM_TYPES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-3">
        {DAYS.map(day => {
          const dayData = routineData[day.id] || { name: '', desc: '' };
          
          if (!isEditing) {
            return (
              <div key={day.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-foreground/5 group">
                <span className="font-bold w-24 text-[var(--text-muted)] group-hover:text-accent transition-colors">{day.label}</span>
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
              <span className="font-bold w-24 text-accent pt-2">{day.label}</span>
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  placeholder="Ej: Push, Pierna, Descanso"
                  value={dayData.name}
                  onChange={(e) => handleChange(day.id, 'name', e.target.value)}
                  className="flex-1 bg-background border border-border rounded-lg p-2.5 text-sm text-foreground font-semibold focus:ring-2 focus:ring-accent/50 outline-none transition-shadow"
                />
                <input 
                  type="text" 
                  placeholder="Detalles (Ej: Pecho y Tríceps)"
                  value={dayData.desc}
                  onChange={(e) => handleChange(day.id, 'desc', e.target.value)}
                  className="flex-[2] bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-shadow"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
