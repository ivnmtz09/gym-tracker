import { useState } from 'react';
import CheckInForm from './CheckInForm';
import Stats from './Stats';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const routineMap = {
  1: { day: 'Lunes', name: "Día 1: Push (Pecho, Hombro, Tríceps)", time: "08:00 a.m. - 10:00 a.m." },
  2: { day: 'Martes', name: "Día 2: Pull (Espalda, Bíceps)", time: "07:00 p.m. - 09:00 p.m." },
  3: { day: 'Miércoles', name: "Día 3: Legs (Piernas, Abdomen)", time: "07:45 p.m. - 09:45 p.m." },
  4: { day: 'Jueves', name: "Día 4: Push (Pecho, Hombro, Tríceps)", time: "07:00 p.m. - 09:00 p.m." },
  5: { day: 'Viernes', name: "Día 5: Pull (Espalda, Bíceps)", time: "03:00 p.m. - 05:00 p.m." },
  6: { day: 'Sábado', name: "Día 6: Legs (Piernas, Abdomen)", time: "07:30 a.m. - 09:30 a.m." },
  0: { day: 'Domingo', name: "Descanso", time: "Libre" }
};

export default function Dashboard({ user }) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);

  const todayIndex = new Date().getDay();
  const todaysRoutine = routineMap[todayIndex];

  const handleCheckInSuccess = () => {
    setShowCheckIn(false);
    setRefreshStats(prev => prev + 1);
  };

  // Extraer nombre del email para el saludo
  const userName = user.email.split('@')[0];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">¡Hola, {userName}! 👋</h2>
        <p className="text-gray-600 mt-1">Aquí está tu resumen de hoy.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tarjeta de Rutina */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-indigo-500" />
            <h3 className="text-xl font-semibold text-gray-800">Rutina de Hoy</h3>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
            <p className="text-indigo-900 font-bold text-lg">{todaysRoutine.day}</p>
            <p className="text-indigo-800 mt-1">{todaysRoutine.name}</p>
            <div className="flex items-center gap-1 mt-3 text-indigo-700 text-sm font-medium">
              <Clock size={16} />
              <span>{todaysRoutine.time}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowCheckIn(!showCheckIn)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            <CheckCircle size={20} />
            Hacer Check-in
          </button>
        </div>

        {/* Formulario de Check-in (Condicional) */}
        {showCheckIn && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <CheckInForm 
              user={user} 
              onSuccess={handleCheckInSuccess} 
              onCancel={() => setShowCheckIn(false)} 
            />
          </div>
        )}
      </div>

      {/* Sección de Estadísticas */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <Stats user={user} refreshTrigger={refreshStats} />
      </div>
    </div>
  );
}
