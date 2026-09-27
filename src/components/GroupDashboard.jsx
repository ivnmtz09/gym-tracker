import { useState, useEffect } from 'react';
import { createGroup, joinGroup, getGroupData, getGroupCheckIns } from '../services/db';
import { Users, Copy, Check, UsersRound, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GroupDashboard({ user, profile, onProfileUpdate }) {
  const [groupData, setGroupData] = useState(null);
  const [groupCheckIns, setGroupCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  // States para Crear/Unirse
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      if (profile?.groupId) {
        const data = await getGroupData(profile.groupId);
        setGroupData(data);
        if (data?.members) {
          const checks = await getGroupCheckIns(data.members);
          setGroupCheckIns(checks);
        }
      }
      setLoading(false);
    };
    loadGroup();
  }, [profile?.groupId]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError('');
    if (!groupName.trim()) return;

    const displayName = profile?.displayName || user.email.split('@')[0];
    const res = await createGroup(groupName, user.uid, displayName);
    if (res.success) {
      onProfileUpdate({ ...profile, groupId: res.id });
    } else {
      setError('Error al crear el grupo.');
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setError('');
    if (!joinCode.trim()) return;

    const displayName = profile?.displayName || user.email.split('@')[0];
    const res = await joinGroup(joinCode.trim(), user.uid, displayName);
    if (res.success) {
      onProfileUpdate({ ...profile, groupId: joinCode.trim() });
    } else {
      setError(res.error || 'Error al unirse al grupo.');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(groupData.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Cargando comunidad...</div>;
  }

  // --- VISTA: NO TIENE GRUPO ---
  if (!profile?.groupId || !groupData) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comunidad y Amigos</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Crea un grupo o únete a uno existente para entrenar con amigos o tu pareja.</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Crear Grupo */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Crear un Grupo Nuevo</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre del Grupo</label>
                <input 
                  type="text" 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Ej: Gym Bros 2026"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Crear Grupo
              </button>
            </form>
          </div>

          {/* Unirse a Grupo */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Unirse con Código</h3>
            <form onSubmit={handleJoinGroup} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Código de Invitación</label>
                <input 
                  type="text" 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Pega el código aquí..."
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                Unirme al Grupo
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA: YA TIENE GRUPO ---
  // Preparar datos para el Leaderboard (Asistencias este mes)
  const today = new Date();
  const currentMonthCheckIns = groupCheckIns.filter(ci => {
    return ci.date.getMonth() === today.getMonth() && ci.date.getFullYear() === today.getFullYear() && ci.attended;
  });

  const leaderboard = {};
  groupData.members.forEach(memberId => {
    leaderboard[memberId] = {
      name: groupData.memberNames[memberId] || 'Usuario',
      count: 0
    };
  });

  currentMonthCheckIns.forEach(ci => {
    if (leaderboard[ci.userId]) {
      leaderboard[ci.userId].count += 1;
    }
  });

  const chartData = Object.values(leaderboard).sort((a, b) => b.count - a.count);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
            <UsersRound size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{groupData.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{groupData.members.length} miembros activos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-2 pl-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <span className="text-sm font-mono text-gray-600 dark:text-gray-300">{groupData.id}</span>
          <button 
            onClick={copyCode}
            className="p-2 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-md border border-gray-200 dark:border-gray-500 transition-colors"
            title="Copiar Código"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500 dark:text-gray-300" />}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Leaderboard Chart */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Leaderboard del Mes
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontWeight: 600 }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Group Activity */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {groupCheckIns.slice().reverse().filter(ci => ci.attended).slice(0, 5).map(ci => (
              <div key={ci.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {groupData.memberNames[ci.userId] || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {ci.date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} • Intensidad: {ci.intensity || 'Normal'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Check size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            ))}
            {groupCheckIns.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Sin actividad reciente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
