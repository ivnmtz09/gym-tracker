import { useState } from 'react';
import { saveUserProfile } from '../services/db';
import { PROGRAM_TYPES } from '../data/routines';
import { Activity } from 'lucide-react';

export default function Onboarding({ user, onComplete }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('otro');
  const [programId, setProgramId] = useState('ppl');
  const [trainingDays, setTrainingDays] = useState([1, 2, 3, 4, 5, 6]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = [
    { id: 1, label: 'L' },
    { id: 2, label: 'M' },
    { id: 3, label: 'M' },
    { id: 4, label: 'J' },
    { id: 5, label: 'V' },
    { id: 6, label: 'S' },
    { id: 0, label: 'D' }
  ];

  const toggleDay = (dayId) => {
    setTrainingDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const h = parseFloat(height);
    const w = parseFloat(weight);
    let imc = 0;
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      imc = w / (heightInMeters * heightInMeters);
    }

    const profileData = {
      displayName: user.displayName || user.email.split('@')[0],
      height: h,
      weight: w,
      gender,
      programId,
      trainingDays,
      initialImc: imc.toFixed(2),
      createdAt: new Date().toISOString()
    };

    await saveUserProfile(user.uid, profileData);
    setIsSubmitting(false);
    onComplete(profileData);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mt-10">
      <div className="flex justify-center mb-6">
        <div className="bg-primary-100 p-4 rounded-full text-primary-600">
          <Activity size={32} />
        </div>
      </div>
      <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">Bienvenido a ForgeFit</h2>
      <p className="text-slate-500 text-center mb-8">Vamos a configurar tu perfil para personalizar tu experiencia.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Estatura (cm)</label>
            <input 
              type="number" 
              required
              min="100" max="250"
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              value={height} onChange={(e) => setHeight(e.target.value)}
              placeholder="Ej: 175"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Peso (kg)</label>
            <input 
              type="number" 
              required
              min="30" max="200" step="0.1"
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej: 70.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Género</label>
          <select 
            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
            value={gender} onChange={(e) => setGender(e.target.value)}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Prefiero no decirlo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">¿Cuál es tu programa de entrenamiento?</label>
          <select 
            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
            value={programId} onChange={(e) => setProgramId(e.target.value)}
          >
            <optgroup label="Fuerza y Estetica">
              <option value="ppl">{PROGRAM_TYPES.ppl}</option>
              <option value="torso_pierna">{PROGRAM_TYPES.torso_pierna}</option>
              <option value="weider">{PROGRAM_TYPES.weider}</option>
              <option value="full_body">{PROGRAM_TYPES.full_body}</option>
            </optgroup>
            <optgroup label="Fuerza Pura">
              <option value="powerlifting">{PROGRAM_TYPES.powerlifting}</option>
              <option value="halterofilia">{PROGRAM_TYPES.halterofilia}</option>
              <option value="strongman">{PROGRAM_TYPES.strongman}</option>
            </optgroup>
            <optgroup label="Metabolico y Funcional">
              <option value="crossfit">{PROGRAM_TYPES.crossfit}</option>
              <option value="funcional">{PROGRAM_TYPES.funcional}</option>
              <option value="calistenia">{PROGRAM_TYPES.calistenia}</option>
            </optgroup>
            <optgroup label="Alta Intensidad">
              <option value="hiit">{PROGRAM_TYPES.hiit}</option>
              <option value="tabata">{PROGRAM_TYPES.tabata}</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">¿Qué días vas a entrenar?</label>
          <div className="flex justify-between gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors ${
                  trainingDays.includes(day.id)
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || trainingDays.length === 0}
          className="w-full bg-primary-600 text-white font-bold p-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition disabled:opacity-70"
        >
          {isSubmitting ? 'Guardando...' : 'Comenzar a Entrenar'}
        </button>
      </form>
    </div>
  );
}
