import { useState, useEffect } from 'react';
import CheckInForm from './CheckInForm';
import Stats from './Stats';
import MuscleMap from './MuscleMap';
import CalendarView from './CalendarView';
import GroupDashboard from './GroupDashboard';
import { Calendar, Clock, CheckCircle, Flame, Activity, Trash2, LayoutDashboard, CalendarDays, UsersRound } from 'lucide-react';
import { ROUTINES, PROGRAM_TYPES } from '../data/routines';
import { getUserCheckIns, deleteCheckIn, saveUserProfile } from '../services/db';

export default function Dashboard({ user, profile: initialProfile }) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);
  const [allCheckIns, setAllCheckIns] = useState([]);
  const [todayCheckIns, setTodayCheckIns] = useState([]);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'calendar' | 'group'
  const [profile, setProfile] = useState(initialProfile);

  const todayIndex = new Date().getDay();
  
  const programId = profile?.programId || 'ppl';
  const routineMap = ROUTINES[programId] || ROUTINES['default'];
  const todaysRoutine = routineMap[todayIndex] || routineMap['default'];
  const programName = PROGRAM_TYPES[programId] || "Programa General";
  
  const isRestDay = todayIndex === 0 || todaysRoutine.type === 'rest';

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

  const displayName = profile?.displayName || user.email.split('@')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Hola, <span className="text-primary-600 dark:text-primary-500">{capitalizedName}</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
            Programa: <strong className="text-gray-900 dark:text-gray-200">{programName}</strong>
          </p>
        </div>
        
        {profile?.initialImc && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tu IMC</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{profile.initialImc}</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-lg ${isRestDay ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'}`}>
                  {isRestDay ? <Flame size={24} /> : <Calendar size={24} />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Plan de Hoy</h3>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-600 mb-6 flex flex-col xl:flex-row justify-between items-center gap-4">
                <div className="flex-1 w-full">
                  <p className="text-sm font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{todaysRoutine.name}</p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">{todaysRoutine.desc}</p>
                  
                  {!isRestDay && (
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
                      <Clock size={16} className="text-primary-600 dark:text-primary-500" />
                      <span>~60 min</span>
                    </div>
                  )}
                </div>

                {!isRestDay && (
                  <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 flex-shrink-0 flex items-center justify-center shadow-sm p-1">
                    <MuscleMap routineDesc={todaysRoutine.desc} />
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={() => setShowCheckIn(!showCheckIn)}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-medium text-white transition-all focus:ring-4 focus:outline-none ${
                    showCheckIn 
                      ? 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700' 
                      : 'bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                  }`}
                >
                  <CheckCircle size={20} />
                  {showCheckIn ? 'Cancelar Check-in' : 'Hacer Check-in'}
                </button>
              </div>
            </div>
          </div>

          {todayCheckIns.length > 0 && !showCheckIn && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Registros de hoy</h4>
              <div className="space-y-3">
                {todayCheckIns.map(ci => (
                  <div key={ci.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center group">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {ci.attended ? (
                          <span className="flex w-2.5 h-2.5 bg-green-500 rounded-full" />
                        ) : (
                          <span className="flex w-2.5 h-2.5 bg-red-500 rounded-full" />
                        )}
                        {ci.attended ? 'Asistencia' : 'No asistió'} a las {ci.time || 'N/A'}
                      </p>
                      {ci.intensity && (
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 capitalize">
                          Intensidad: {ci.intensity}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDelete(ci.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-gray-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
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
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full animate-in slide-in-from-right-8 duration-300">
              <CheckInForm 
                user={user} 
                onSuccess={handleCheckInSuccess} 
                onCancel={() => setShowCheckIn(false)} 
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
              {/* Tab Navigation - Flowbite Style */}
              <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-6">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <button 
                      onClick={() => setActiveTab('stats')}
                      className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${
                        activeTab === 'stats' 
                          ? 'text-primary-600 border-primary-600 active dark:text-primary-500 dark:border-primary-500' 
                          : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                      }`}
                    >
                      <LayoutDashboard size={18} /> Estadísticas
                    </button>
                  </li>
                  <li className="mr-2">
                    <button 
                      onClick={() => setActiveTab('calendar')}
                      className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${
                        activeTab === 'calendar' 
                          ? 'text-primary-600 border-primary-600 active dark:text-primary-500 dark:border-primary-500' 
                          : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                      }`}
                    >
                      <CalendarDays size={18} /> Calendario
                    </button>
                  </li>
                  <li className="mr-2">
                    <button 
                      onClick={() => setActiveTab('group')}
                      className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${
                        activeTab === 'group' 
                          ? 'text-primary-600 border-primary-600 active dark:text-primary-500 dark:border-primary-500' 
                          : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                      }`}
                    >
                      <UsersRound size={18} /> Comunidad
                    </button>
                  </li>
                </ul>
              </div>

              <div className="flex-1 relative">
                {activeTab === 'stats' && <Stats user={user} refreshTrigger={refreshStats} />}
                {activeTab === 'calendar' && <CalendarView checkIns={allCheckIns} />}
                {activeTab === 'group' && <GroupDashboard user={user} profile={profile} onProfileUpdate={setProfile} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
