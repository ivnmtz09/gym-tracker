import { useState, useEffect } from 'react';
import { createGroup, joinGroup, getGroupData, getGroupCheckIns } from '../services/db';
import { Users, Copy, Check, UsersRound, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CommunityPage({ user, profile, onProfileUpdate }) {
  const [groupData, setGroupData] = useState(null);
  const [groupCheckIns, setGroupCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // --- VISTA: NO TIENE GRUPO ---
  if (!profile?.groupId || !groupData) {
    return (
      <div className="glass-card p-8 sm:p-10 max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Users className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-3">Comunidad ForgeFit</h2>
          <p className="text-foreground/60 text-lg">Crea un grupo o únete a uno existente para entrenar con amigos o tu pareja.</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-6 font-medium">{error}</p>}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-foreground/5 p-8 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6">Crear Grupo Nuevo</h3>
            <form onSubmit={handleCreateGroup} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground/80">Nombre del Grupo</label>
                <input 
                  type="text" 
                  className="bg-background border border-border text-foreground text-sm rounded-xl focus:ring-4 focus:ring-accent/20 focus:border-accent block w-full p-3.5 transition-all"
                  placeholder="Ej: Gym Bros 2026"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full btn-accent font-bold rounded-xl text-sm px-5 py-3.5">
                Crear Grupo
              </button>
            </form>
          </div>

          <div className="bg-foreground/5 p-8 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6">Unirse con Código</h3>
            <form onSubmit={handleJoinGroup} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground/80">Código de Invitación</label>
                <input 
                  type="text" 
                  className="bg-background border border-border text-foreground text-sm rounded-xl focus:ring-4 focus:ring-accent/20 focus:border-accent block w-full p-3.5 transition-all"
                  placeholder="Pega el código aquí..."
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-background border border-border text-foreground hover:bg-foreground/5 font-bold rounded-xl text-sm px-5 py-3.5 transition-all">
                Unirme al Grupo
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA: YA TIENE GRUPO ---
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
  const colors = ['var(--theme-accent)', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="glass-card p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-accent/20 p-4 rounded-2xl text-accent shadow-inner">
            <UsersRound size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{groupData.name}</h2>
            <p className="text-foreground/60 font-medium mt-1">{groupData.members.length} miembros activos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-foreground/5 p-2 pl-5 rounded-2xl border border-border shadow-sm">
          <span className="text-sm font-mono font-bold text-foreground/80">{groupData.id}</span>
          <button 
            onClick={copyCode}
            className="p-2.5 bg-background hover:bg-foreground/10 rounded-xl border border-border transition-all shadow-sm active:scale-95"
            title="Copiar Código"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-foreground/60" />}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-foreground/5 p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Trophy className="text-yellow-500 w-6 h-6" /> Leaderboard del Mes
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }} width={90} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-foreground/5 p-6 sm:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-foreground mb-6">Actividad Reciente</h3>
          <div className="space-y-4 flex-1">
            {groupCheckIns.slice().reverse().filter(ci => ci.attended).slice(0, 5).map(ci => (
              <div key={ci.id} className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
                <div>
                  <p className="font-bold text-foreground">
                    {groupData.memberNames[ci.userId] || 'Usuario'}
                  </p>
                  <p className="text-sm font-medium text-foreground/60 capitalize mt-0.5">
                    {ci.date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} • <span className="text-accent">{ci.intensity || 'Normal'}</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shadow-inner">
                  <Check size={18} className="text-accent" />
                </div>
              </div>
            ))}
            {groupCheckIns.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                <UsersRound size={48} className="mb-4 text-foreground/50" />
                <p className="text-lg font-medium text-foreground/60">Sin actividad reciente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
