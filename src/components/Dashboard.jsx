import { useState } from 'react';
import CheckInForm from './CheckInForm';
import Stats from './Stats';
import { Calendar, Clock, CheckCircle, Flame, Activity } from 'lucide-react';
import { ROUTINES, PROGRAM_TYPES } from '../data/routines';

export default function Dashboard({ user, profile }) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);

  const todayIndex = new Date().getDay();
  
  // Lógica dinámica de rutinas
  const programId = profile?.programId || 'ppl';
  const routineMap = ROUTINES[programId] || ROUTINES['default'];
  const todaysRoutine = routineMap[todayIndex] || routineMap['default'];
  const programName = PROGRAM_TYPES[programId] || "Programa General";
  
  const isRestDay = todayIndex === 0 || todaysRoutine.type === 'rest';

  const handleCheckInSuccess = () => {
    setShowCheckIn(false);
    setRefreshStats(prev => prev + 1);
  };

  const displayName = profile?.displayName || user.email.split('@')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            ¡Hola, <span className="text-blue-600">{capitalizedName}</span>! 👋
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Programa actual: <strong className="text-slate-700">{programName}</strong>
          </p>
        </div>
        
        {/* Widget de Salud Inicial */}
        {profile?.initialImc && (
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tu IMC</p>
              <p className="text-lg font-bold text-slate-800">{profile.initialImc}</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl ${isRestDay ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {isRestDay ? <Flame size={24} /> : <Calendar size={24} />}
                </div>
                <h3 className="text-xl font-bold text-slate-800">Tu Plan de Hoy</h3>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8 transition-colors hover:bg-slate-100/50">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                  </p>
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1">{todaysRoutine.name}</p>
                <p className="text-slate-600 font-medium mb-4">{todaysRoutine.desc}</p>
                
                {!isRestDay && (
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
                    <Clock size={16} className="text-blue-500" />
                    <span>~60 min</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowCheckIn(!showCheckIn)}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                  showCheckIn 
                    ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/25'
                }`}
              >
                <CheckCircle size={22} />
                {showCheckIn ? 'Cancelar Check-in' : 'Hacer Check-in'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {showCheckIn ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full animate-in slide-in-from-right-8 duration-300">
              <CheckInForm 
                user={user} 
                onSuccess={handleCheckInSuccess} 
                onCancel={() => setShowCheckIn(false)} 
              />
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col">
              <Stats user={user} refreshTrigger={refreshStats} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
