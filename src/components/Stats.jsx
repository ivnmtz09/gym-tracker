import { useState, useEffect } from 'react';
import { getAllCheckIns } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';

export default function Stats({ user, refreshTrigger }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const checkIns = await getAllCheckIns();
      
      const groupedData = {};

      checkIns.forEach(ci => {
        if (!ci.attended) return;
        
        const dateObj = ci.date;
        const dateKey = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = { date: dateKey };
        }
        
        const userName = ci.userEmail ? ci.userEmail.split('@')[0] : 'Usuario';
        const capName = userName.charAt(0).toUpperCase() + userName.slice(1);
        
        groupedData[dateKey][capName] = (groupedData[dateKey][capName] || 0) + 1;
      });

      const chartData = Object.values(groupedData);
      chartData.sort((a, b) => {
        const [dayA, monthA] = a.date.split('/');
        const [dayB, monthB] = b.date.split('/');
        return new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB);
      });

      setData(chartData);
      setLoading(false);
    };

    fetchStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-foreground/50 min-h-[300px]">
        <div className="w-10 h-10 border-4 border-foreground/10 border-t-accent rounded-full animate-spin mb-4" />
        <p className="font-medium animate-pulse">Cargando métricas...</p>
      </div>
    );
  }

  const userKeys = Array.from(new Set(data.flatMap(Object.keys).filter(k => k !== 'date')));
  const colors = ['var(--theme-accent)', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2.5 rounded-xl">
            <Activity className="text-accent" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Progreso de Asistencia</h3>
            <p className="text-sm text-foreground/60 font-medium">Comparativa mensual</p>
          </div>
        </div>
        
        {data.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
            <TrendingUp size={16} />
            <span>En racha</span>
          </div>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-foreground/5 rounded-2xl border-2 border-dashed border-border">
          <div className="bg-card p-4 rounded-full shadow-sm mb-4">
            <Activity size={32} className="text-foreground/30" />
          </div>
          <p className="text-foreground/60 font-medium max-w-[250px]">
            Aún no hay registros. ¡Haz tu primer check-in para ver las gráficas!
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }} 
                tickLine={false} 
                axisLine={{ stroke: 'var(--border-color)' }} 
                dy={10}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fill: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: 'var(--bg-primary)', opacity: 0.4 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid var(--border-color)', 
                  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px',
                  fontWeight: '600',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }} 
                iconType="circle"
              />
              {userKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  name={key} 
                  fill={colors[index % colors.length]} 
                  radius={[6, 6, 0, 0]}
                  barSize={maxBarSize()}
                  maxBarSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function maxBarSize() {
  return typeof window !== 'undefined' && window.innerWidth < 640 ? 20 : 40;
}
