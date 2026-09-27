import { useState } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, isToday, addMonths, subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function CalendarView({ checkIns }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getCheckInForDay = (day) => {
    return checkIns.find(ci => ci.date && isSameDay(ci.date, day));
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'suave': return 'bg-green-400';
      case 'normal': return 'bg-blue-500';
      case 'fuerte': return 'bg-purple-500';
      case 'extremo': return 'bg-red-600';
      default: return 'bg-blue-500';
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2 gap-1 sm:gap-2">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center font-semibold text-sm text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, i) => {
          const ci = getCheckInForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);

          return (
            <div 
              key={i} 
              onClick={() => ci && setSelectedCheckIn(ci)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl border p-1 transition-all cursor-pointer relative ${
                !isCurrentMonth ? 'opacity-30 border-transparent pointer-events-none' : 
                isDayToday ? 'border-blue-500 font-bold bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              } ${ci ? 'bg-gray-50 dark:bg-gray-750' : 'bg-white dark:bg-gray-800'}`}
            >
              <span className={`text-sm sm:text-base ${isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </span>
              
              {ci && ci.attended && (
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-2 ${getIntensityColor(ci.intensity)} shadow-sm`} />
              )}
              {ci && !ci.attended && (
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-2 bg-gray-300 dark:bg-gray-600" />
              )}
            </div>
          );
        })}
      </div>

      {selectedCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700 relative animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Detalle del Día
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 capitalize">
              {format(selectedCheckIn.date, 'EEEE d, MMMM yyyy', { locale: es })}
            </p>

            {selectedCheckIn.attended ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Intensidad</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white capitalize px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                    {selectedCheckIn.intensity || 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hora</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {selectedCheckIn.time || 'N/A'}
                  </span>
                </div>
                {selectedCheckIn.currentWeight && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Peso</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedCheckIn.currentWeight} kg
                    </span>
                  </div>
                )}
                {selectedCheckIn.notes && (
                  <div className="pt-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Notas</span>
                    <p className="text-sm text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      {selectedCheckIn.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center">
                <span className="inline-block p-3 rounded-full bg-red-100 text-red-600 mb-2">
                  <X size={24} />
                </span>
                <p className="font-semibold text-gray-900 dark:text-white">Día de no asistencia</p>
              </div>
            )}

            <button 
              onClick={() => setSelectedCheckIn(null)}
              className="mt-6 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 justify-center">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-400" /> Suave</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Normal</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Fuerte</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600" /> Extremo</div>
      </div>
    </div>
  );
}
