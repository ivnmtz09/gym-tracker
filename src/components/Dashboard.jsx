import { useState, useEffect } from 'react';
import CheckInForm from './CheckInForm';
import Stats from './Stats';
import MuscleMap from './MuscleMap';
import { Calendar, Clock, CheckCircle, Flame, Activity, Trash2, Edit } from 'lucide-react';
import { ROUTINES, PROGRAM_TYPES } from '../data/routines';
import { getUserCheckIns, deleteCheckIn } from '../services/db';

export default function Dashboard({ user, profile }) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);
  const [todayCheckIns, setTodayCheckIns] = useState([]);

  const todayIndex = new Date().getDay();
  
  const programId = profile?.programId || 'ppl';
  const routineMap = ROUTINES[programId] || ROUTINES['default'];
  const todaysRoutine = routineMap[todayIndex] || routineMap['default'];
  const programName = PROGRAM_TYPES[programId] || "Programa General";
  
  const isRestDay = todayIndex === 0 || todaysRoutine.type === 'rest';

  const loadTodayCheckIns = async () => {
    const all = await getUserCheckIns(user.uid);
    const today = new Date();
    const filtered = all.filter(ci => {
      const ciDate = ci.date;
      return ciDate.getDate() === today.getDate() && ciDate.getMonth() === today.getMonth();
    });
    setTodayCheckIns(filtered);
  };

  useEffect(() => {
    loadTodayCheckIns();
  }, [refreshStats, user.uid]);

  const handleCheckInSuccess = () => {
    setShowCheckIn(false);
    setRefreshStats(prev => prev + 1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este registro?")) {
      await deleteCheckIn(id);
      setRefreshStats(prev => prev + 1);
    }
  };

  const displayName = profile?.displayName || user.email.split('@')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Hola, <span className="text-blue-600">{capitalizedName}</span>
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Programa actual: <strong className="text-slate-700">{programName}</strong>
          </p>
        </div>
        
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
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isRestDay ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isRestDay ? <Flame size={24} /> : <Calendar size={24} />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Tu Plan de Hoy</h3>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 transition-colors hover:bg-slate-100/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-2">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mb-1">{todaysRoutine.name}</p>
                  <p className="text-slate-600 font-medium mb-4">{todaysRoutine.desc}</p>
                  
                  {!isRestDay && (
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
                      <Clock size={16} className="text-blue-500" />
                      <span>~60 min</span>
                    </div>
                  )}
                </div>

                {!isRestDay && (
                  <div className="w-32 h-32 bg-white rounded-xl border border-slate-100 flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                    <MuscleMap routineDesc={todaysRoutine.desc} />
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
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

          {/* Historial de Hoy */}
          {todayCheckIns.length > 0 && !showCheckIn && (
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h4 className="text-lg font-bold text-slate-800 mb-4">Registros de hoy</h4>
              <div className="space-y-3">
                {todayCheckIns.map(ci => (
                  <div key={ci.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center group">
                    <div>
                      <p className="font-semibold text-slate-700">
                        {ci.attended ? 'Asistió' : 'No asistió'} a las {ci.time || 'N/A'}
                      </p>
                      {ci.notes && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{ci.notes}</p>}
                    </div>
                    <button 
                      onClick={() => handleDelete(ci.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar registro"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
