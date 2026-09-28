import { useState, useEffect } from 'react';
import { saveUserProfile } from '../services/db';
import { Trophy, Edit2, Check, X } from 'lucide-react';

const EXERCISES = [
  { id: 'bench', label: 'Press Banca', icon: '🏋️' },
  { id: 'squat', label: 'Sentadilla', icon: '🦵' },
  { id: 'deadlift', label: 'Peso Muerto', icon: '🔥' }
];

export default function PersonalRecords({ user, profile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [prs, setPrs] = useState({ bench: '', squat: '', deadlift: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.prs) {
      setPrs(profile.prs);
    }
  }, [profile?.prs]);

  const handleChange = (id, value) => {
    setPrs(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedProfile = { ...profile, prs };
    await saveUserProfile(user.uid, updatedProfile);
    onProfileUpdate(updatedProfile);
    setIsEditing(false);
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 sm:p-8 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 text-foreground">
             <Trophy className="text-yellow-500" /> Récords Personales (PRs)
          </h4>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Registra tu 1RM (Repetición Máxima) en kg.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXERCISES.map(ex => (
          <div key={ex.id} className="bg-foreground/5 p-4 rounded-2xl border border-border flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground flex items-center gap-2">
                {ex.icon} {ex.label}
              </span>
            </div>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  placeholder="0"
                  value={prs[ex.id] || ''}
                  onChange={(e) => handleChange(ex.id, e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
                <span className="text-foreground/60 font-bold">kg</span>
              </div>
            ) : (
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-accent">
                  {prs[ex.id] || '0'}
                </span>
                <span className="text-foreground/60 font-bold">kg</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
