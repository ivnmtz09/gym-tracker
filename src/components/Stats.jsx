import { useState, useEffect } from 'react';
import { getAllCheckIns } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

export default function Stats({ user, refreshTrigger }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const checkIns = await getAllCheckIns();
      
      // Procesar datos para la gráfica
      // Agruparemos por fecha (ej: 'DD/MM') y contaremos si Ivan y/o Saudith asistieron
      const groupedData = {};

      checkIns.forEach(ci => {
        if (!ci.attended) return; // Solo contamos las asistencias
        
        // Formatear fecha
        const dateObj = ci.date;
        const dateKey = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = { date: dateKey };
        }
        
        // Usar email o displayName para la leyenda. Extraemos el nombre:
        const userName = ci.userEmail ? ci.userEmail.split('@')[0] : 'Usuario';
        
        groupedData[dateKey][userName] = (groupedData[dateKey][userName] || 0) + 1;
      });

      // Convertir a array
      const chartData = Object.values(groupedData);
      // Ordenar por fecha (asumiendo mismo año para simplificar)
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

  if (loading) return <div className="animate-pulse flex space-x-4">Cargando estadísticas...</div>;

  // Obtener nombres de usuarios únicos de los datos para crear las barras dinámicamente
  const userKeys = Array.from(new Set(data.flatMap(Object.keys).filter(k => k !== 'date')));

  const colors = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b']; // Indigo, Pink, Emerald, Amber

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-indigo-500" />
        <h3 className="text-xl font-semibold text-gray-800">Progreso de Asistencia</h3>
      </div>
      
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
          Aún no hay registros de asistencia. ¡Haz tu primer check-in!
        </p>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis allowDecimals={false} tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {userKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  name={key} 
                  fill={colors[index % colors.length]} 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
