import { useState } from 'react';
import CheckInForm from './CheckInForm';
import Stats from './Stats';
import { Calendar, Clock, CheckCircle, Flame } from 'lucide-react';

const routineMap = {
  1: { day: 'Lunes', name: "Día 1: Push", desc: "Pecho, Hombro, Tríceps", time: "08:00 a.m. - 10:00 a.m." },
  2: { day: 'Martes', name: "Día 2: Pull", desc: "Espalda, Bíceps", time: "07:00 p.m. - 09:00 p.m." },
  3: { day: 'Miércoles', name: "Día 3: Legs", desc: "Piernas, Abdomen", time: "07:45 p.m. - 09:45 p.m." },
  4: { day: 'Jueves', name: "Día 4: Push", desc: "Pecho, Hombro, Tríceps", time: "07:00 p.m. - 09:00 p.m." },
  5: { day: 'Viernes', name: "Día 5: Pull", desc: "Espalda, Bíceps", time: "03:00 p.m. - 05:00 p.m." },
  6: { day: 'Sábado', name: "Día 6: Legs", desc: "Piernas, Abdomen", time: "07:30 a.m. - 09:30 a.m." },
  0: { day: 'Domingo', name: "Descanso Activo", desc: "Libre", time: "Libre" }
};

export default function Dashboard({ user }) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);

  const todayIndex = new Date().getDay();
  const todaysRoutine = routineMap[todayIndex];
  const isRestDay = todayIndex === 0;

  const handleCheckInSuccess = () => {
    setShowCheckIn(false);
    setRefreshStats(prev => prev + 1);
  };

  const userName = user.email.split('@')[0];
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            ¡Hola, <span className="text-blue-600">{capitalizedName}</span>! 👋
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Es hora de romper tus límites hoy.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Tarjeta de Rutina (Ocupa 2 columnas en lg) */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 relative overflow-hidden group">
            
            {/* Decoración de fondo */}
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
                  <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">{todaysRoutine.day}</p>
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1">{todaysRoutine.name}</p>
                <p className="text-slate-600 font-medium mb-4">{todaysRoutine.desc}</p>
                
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
                  <Clock size={16} className="text-blue-500" />
                  <span>{todaysRoutine.time}</span>
                </div>
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

        {/* Área interactiva: Formulario o Stats rápidos (Ocupa 3 columnas) */}
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
