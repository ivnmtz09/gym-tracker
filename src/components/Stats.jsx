import { useState, useEffect } from 'react';
import { getAllCheckIns } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
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
      <div className="flex-1 flex flex-col justify-center items-center text-slate-400 min-h-[300px]">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="font-medium animate-pulse">Cargando métricas...</p>
      </div>
    );
  }

  const userKeys = Array.from(new Set(data.flatMap(Object.keys).filter(k => k !== 'date')));
  // Modern colors that map well together
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-xl">
            <Activity className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Progreso de Asistencia</h3>
            <p className="text-sm text-slate-500 font-medium">Comparativa mensual</p>
          </div>
        </div>
        
        {data.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <TrendingUp size={16} />
            <span>En racha</span>
          </div>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Activity size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-600 font-medium max-w-[250px]">
            Aún no hay registros. ¡Haz tu primer check-in para ver las gráficas!
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }} 
                dy={10}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px',
                  fontWeight: '600',
                  color: '#1e293b'
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
                  barSize={maxBarSize()} // Responsive logic or fixed width
                  maxBarSize={40}
                >
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function maxBarSize() {
  return window.innerWidth < 640 ? 20 : 40;
}
