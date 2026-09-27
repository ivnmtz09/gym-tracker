import { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const INTENSITY_COLORS = {
  suave: 'bg-green-500',
  normal: 'bg-blue-500',
  fuerte: 'bg-orange-500',
  extremo: 'bg-red-500'
};

export default function CalendarView({ checkIns }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getCheckInForDate = (date) => {
    return checkIns.find(ci => isSameDay(ci.date, date) && ci.attended);
  };

  return (
    <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border flex flex-col h-full shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-foreground capitalize flex items-center gap-2">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex gap-2">
          <button onClick={onPrevMonth} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={onNextMonth} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
          <div key={idx} className="text-center font-bold text-foreground/50 text-xs sm:text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const checkIn = getCheckInForDate(day);
          
          let dayClass = "flex flex-col items-center justify-center p-2 rounded-2xl border border-transparent transition-all h-14 sm:h-20 ";
          
          if (!isCurrentMonth) {
            dayClass += "opacity-30 ";
          }

          if (checkIn) {
            const intensityColor = INTENSITY_COLORS[checkIn.intensity] || 'bg-accent';
            dayClass += `${intensityColor} text-white shadow-md transform hover:scale-105 cursor-pointer `;
          } else if (isToday) {
            dayClass += "bg-accent/20 text-accent border-accent/50 font-bold ";
          } else {
            dayClass += "bg-foreground/5 hover:bg-foreground/10 text-foreground ";
          }

          return (
            <div key={idx} className={dayClass} title={checkIn ? `Intensidad: ${checkIn.intensity}` : ''}>
              <span className="text-sm sm:text-lg font-semibold">{format(day, 'd')}</span>
              {checkIn && (
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/80 mt-1 shadow-sm"></span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-medium text-foreground/60 border-t border-border pt-4">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500"></span> Suave</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Normal</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Fuerte</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Extremo</div>
      </div>
    </div>
  );
}
