import { useState, useEffect } from 'react';
import CheckInForm from '../components/CheckInForm';
import Stats from '../components/Stats';
import MuscleMap from '../components/MuscleMap';
import CalendarView from '../components/CalendarView';
import { Calendar, Clock, CheckCircle, Flame, Activity, Trash2, LayoutDashboard, CalendarDays } from 'lucide-react';
import { ROUTINES, PROGRAM_TYPES } from '../data/routines';
import { getUserCheckIns, deleteCheckIn } from '../services/db';

export default function DashboardPage({ user, profile }) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);
  const [allCheckIns, setAllCheckIns] = useState([]);
  const [todayCheckIns, setTodayCheckIns] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');

  const todayIndex = new Date().getDay();
  
  const programId = profile?.programId || 'ppl';
  const routineMap = profile?.customRoutine || ROUTINES[programId] || ROUTINES['default'];
  const todaysRoutine = routineMap[todayIndex] || routineMap['default'] || { name: 'Descanso', desc: '', type: 'rest' };
  const programName = programId === 'custom' ? "Plan Personalizado" : (PROGRAM_TYPES[programId] || "Programa General");
  
  const isRestDay = todayIndex === 0 || todaysRoutine.type === 'rest' || !todaysRoutine.name || todaysRoutine.name.toLowerCase().includes('descanso');

  const loadData = async () => {
    const all = await getUserCheckIns(user.uid);
    setAllCheckIns(all);
    const today = new Date();
    const filtered = all.filter(ci => {
      const ciDate = ci.date;
      return ciDate.getDate() === today.getDate() && ciDate.getMonth() === today.getMonth();
    });
    setTodayCheckIns(filtered);
  };

  useEffect(() => {
    loadData();
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

  const displayName = profile?.displayName || user?.email?.split('@')[0];
  const capitalizedName = displayName?.charAt(0).toUpperCase() + displayName?.slice(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Hola, <span className="text-accent">{capitalizedName}</span>
          </h2>
          <p className="text-foreground/70 mt-2 text-lg font-medium">
            Programa: <strong className="text-foreground">{programName}</strong>
          </p>
        </div>
        
        {profile?.initialImc && (
          <div className="glass-card px-4 py-3 flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-xl text-green-500">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Tu IMC</p>
              <p className="text-lg font-bold text-foreground">{profile.initialImc}</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="glass-card p-6 sm:p-8 flex-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl shadow-inner ${isRestDay ? 'bg-green-500/20 text-green-500' : 'bg-accent/20 text-accent'}`}>
                  {isRestDay ? <Flame size={24} /> : <Calendar size={24} />}
                </div>
                <h3 className="text-xl font-bold text-foreground">Plan de Hoy</h3>
              </div>

              <div className="bg-foreground/5 p-5 rounded-2xl border border-border mb-6 flex flex-col xl:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex-1 w-full">
                  <p className="text-sm font-semibold tracking-wider text-foreground/50 uppercase mb-2">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                  </p>
                  <p className="text-2xl font-bold text-foreground mb-1">{todaysRoutine.name}</p>
                  <p className="text-foreground/70 font-medium mb-4">{todaysRoutine.desc}</p>
                  
                  {!isRestDay && (
                    <div className="inline-flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-border text-sm font-semibold text-foreground/70">
                      <Clock size={16} className="text-accent" />
                      <span>~60 min</span>
                    </div>
                  )}
                </div>

                {!isRestDay && (
                  <div className="w-28 h-28 bg-background/50 rounded-2xl border border-border flex-shrink-0 flex items-center justify-center shadow-inner p-1">
                    <MuscleMap routineDesc={todaysRoutine.desc} />
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                {isRestDay ? (
                  <div className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-bold bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20 text-center shadow-inner">
                    <CheckCircle size={22} />
                    <span>¡Día de recuperación! A recargar energías.</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowCheckIn(!showCheckIn)}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold transition-all focus:ring-4 focus:outline-none shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                      showCheckIn 
                        ? 'bg-foreground/10 text-foreground hover:bg-foreground/20' 
                        : 'btn-accent'
                    }`}
                  >
                    <CheckCircle size={22} />
                    {showCheckIn ? 'Cancelar Check-in' : 'Hacer Check-in'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {todayCheckIns.length > 0 && !showCheckIn && (
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold text-foreground mb-4">Registros de hoy</h4>
              <div className="space-y-3">
                {todayCheckIns.map(ci => (
                  <div key={ci.id} className="bg-foreground/5 p-4 rounded-2xl border border-border flex justify-between items-center group">
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        {ci.attended ? (
                          <span className="flex w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        ) : (
                          <span className="flex w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        )}
                        {ci.attended ? 'Asistencia' : 'No asistió'} a las {ci.time || 'N/A'}
                      </p>
                      {ci.intensity && (
                        <p className="text-xs font-medium text-foreground/50 mt-1 capitalize">
                          Intensidad: {ci.intensity}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDelete(ci.id)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
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

        <div className="lg:col-span-3 flex flex-col">
          {showCheckIn ? (
            <div className="glass-card p-6 sm:p-8 h-full animate-in slide-in-from-right-8 duration-300">
              <CheckInForm 
                user={user} 
                onSuccess={handleCheckInSuccess} 
                onCancel={() => setShowCheckIn(false)} 
              />
            </div>
          ) : (
            <div className="glass-card p-6 sm:p-8 h-full flex flex-col">
              <div className="text-sm font-medium text-center text-foreground/50 border-b border-border mb-6">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <button 
                      onClick={() => setActiveTab('stats')}
                      className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-xl transition-colors ${
                        activeTab === 'stats' 
                          ? 'text-accent border-accent' 
                          : 'border-transparent hover:text-foreground/80 hover:border-border'
                      }`}
                    >
                      <LayoutDashboard size={18} /> Estadísticas
                    </button>
                  </li>
                  <li className="mr-2">
                    <button 
                      onClick={() => setActiveTab('calendar')}
                      className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-xl transition-colors ${
                        activeTab === 'calendar' 
                          ? 'text-accent border-accent' 
                          : 'border-transparent hover:text-foreground/80 hover:border-border'
                      }`}
                    >
                      <CalendarDays size={18} /> Calendario
                    </button>
                  </li>
                </ul>
              </div>

              <div className="flex-1 relative">
                {activeTab === 'stats' && <Stats user={user} refreshTrigger={refreshStats} />}
                {activeTab === 'calendar' && <CalendarView checkIns={allCheckIns} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
