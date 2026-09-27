import { useState } from 'react';
import { saveUserProfile } from '../services/db';
import { PROGRAM_TYPES } from '../data/routines';
import Mascot from './Mascot';

const PROGRAM_DESCRIPTIONS = {
  ppl: "Divide el cuerpo en Empuje, Tracción y Piernas. Ideal para masa muscular.",
  torso_pierna: "Alterna días de parte superior e inferior. Excelente balance.",
  weider: "Un grupo muscular por día. Clásico del culturismo.",
  full_body: "Todo el cuerpo en una sesión. Ideal para optimizar tiempo.",
  powerlifting: "Fuerza máxima en Sentadilla, Press Banca y Peso Muerto.",
  halterofilia: "Potencia olímpica: Arrancada y Dos Tiempos.",
  strongman: "Fuerza funcional extrema con objetos pesados.",
  crossfit: "Alta intensidad, gimnasia y levantamientos en WODs.",
  funcional: "Patrones de movimiento para la vida diaria.",
  calistenia: "Dominio del propio peso corporal y barras.",
  hiit: "Cardio intenso por intervalos cortos para quemar grasa.",
  tabata: "Variante extrema de HIIT en solo 4 minutos."
};

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    gender: 'otro',
    programId: 'ppl',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateImc = (w, h) => {
    const weight = parseFloat(w);
    const height = parseFloat(h) / 100;
    if (!weight || !height) return 0;
    return (weight / (height * height)).toFixed(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const initialImc = calculateImc(formData.weight, formData.height);
    const profileData = {
      ...formData,
      initialImc,
      displayName: user.displayName || user.email.split('@')[0],
      createdAt: new Date(),
    };
    
    const res = await saveUserProfile(user.uid, profileData);
    if (res.success) {
      onComplete(profileData);
    } else {
      alert("Hubo un error al guardar tus datos. Por favor, revisa las reglas de seguridad de Firebase en console.firebase.google.com");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10 px-4 sm:px-6 animate-in zoom-in-95 duration-500">
      <div className="max-w-2xl w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        
        <div className="bg-primary-600 dark:bg-primary-800 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <Mascot size={80} className="mx-auto mb-4 drop-shadow-md" />
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Bienvenido a ForgeFit</h2>
          <p className="text-primary-100 mt-2 font-medium">Configuremos tu perfil para forjar tu mejor versión.</p>
        </div>

        <div className="p-8 sm:p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Tus Datos Físicos</h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Estatura (cm)</label>
                  <input 
                    type="number" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange} 
                    className="w-full bg-white/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white dark:bg-gray-800/50 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    placeholder="Ej: 175"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Peso Actual (kg)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange} 
                    className="w-full bg-white/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white dark:bg-gray-800/50 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    placeholder="Ej: 70.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Género</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Masculino', 'Femenino', 'Otro'].map(gen => {
                    const val = gen.toLowerCase();
                    const isSelected = formData.gender === val;
                    return (
                      <button 
                        key={val}
                        onClick={() => setFormData({...formData, gender: val})}
                        className={`py-3 px-4 rounded-xl font-bold transition-all border-2 ${isSelected ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 shadow-md' : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                      >
                        {gen}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.height || !formData.weight}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente Paso
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Tu Programa de Entrenamiento</h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 pb-4">
                {Object.entries(PROGRAM_TYPES).map(([id, title]) => {
                  const isSelected = formData.programId === id;
                  const desc = PROGRAM_DESCRIPTIONS[id] || "Programa de entrenamiento general.";
                  return (
                    <div 
                      key={id}
                      onClick={() => setFormData({...formData, programId: id})}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-primary-300 dark:hover:border-primary-700'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-lg ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {title}
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${isSelected ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {isSelected && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                        </div>
                      </div>
                      <p className={`text-sm ${isSelected ? 'text-primary-600 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'}`}>
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold py-4 rounded-xl transition-all"
                >
                  Volver
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-2/3 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex justify-center items-center"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '¡Empezar a Forjar!'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
