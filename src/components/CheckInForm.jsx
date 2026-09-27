import { useState } from 'react';
import { addCheckIn } from '../services/db';

export default function CheckInForm({ user, onSuccess, onCancel }) {
  const [attended, setAttended] = useState(true);
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState('');
  const [intensity, setIntensity] = useState('normal');
  const [currentWeight, setCurrentWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const confirmMessage = attended 
      ? "¿Confirmas que realizaste tu entrenamiento hoy en el horario indicado?"
      : "¿Confirmas que NO realizaste tu entrenamiento hoy?";
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    const weightVal = currentWeight ? parseFloat(currentWeight) : null;
    const result = await addCheckIn(user.uid, attended, notes, user.email, time, intensity, weightVal);
    
    setIsSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError('Error al guardar el registro. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Registro de Entrenamiento</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Completa los datos de tu sesion para llevar el control.</p>
      </div>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-5 flex-1">
          {/* Attended Toggle - Tailgrids / Flowbite style */}
          <label className="flex items-center cursor-pointer p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input 
              type="checkbox" 
              className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={attended}
              onChange={(e) => setAttended(e.target.checked)}
            />
            <span className="ml-3 text-base font-medium text-gray-900 dark:text-white">
              {attended ? 'Si, asisti a entrenar hoy' : 'No asisti hoy'}
            </span>
          </label>

          <div className={`transition-all duration-300 overflow-hidden space-y-5 ${attended ? 'opacity-100 h-auto' : 'opacity-50 h-0 pointer-events-none'}`}>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Horario
                </label>
                <input 
                  type="time" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!attended}
                  required={attended}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Peso corporal (Opcional, kg)
                </label>
                <input 
                  type="number" step="0.1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  disabled={!attended}
                  placeholder="Ej: 72.5"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Intensidad del Entrenamiento
              </label>
              <ul className="grid w-full gap-4 md:grid-cols-4">
                <li>
                  <input type="radio" id="int-suave" name="intensity" value="suave" className="hidden peer" onChange={(e)=>setIntensity(e.target.value)} checked={intensity==='suave'} />
                  <label htmlFor="int-suave" className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="block text-sm font-semibold">Suave</div>
                  </label>
                </li>
                <li>
                  <input type="radio" id="int-normal" name="intensity" value="normal" className="hidden peer" onChange={(e)=>setIntensity(e.target.value)} checked={intensity==='normal'} />
                  <label htmlFor="int-normal" className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="block text-sm font-semibold">Normal</div>
                  </label>
                </li>
                <li>
                  <input type="radio" id="int-fuerte" name="intensity" value="fuerte" className="hidden peer" onChange={(e)=>setIntensity(e.target.value)} checked={intensity==='fuerte'} />
                  <label htmlFor="int-fuerte" className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="block text-sm font-semibold">Fuerte</div>
                  </label>
                </li>
                <li>
                  <input type="radio" id="int-extremo" name="intensity" value="extremo" className="hidden peer" onChange={(e)=>setIntensity(e.target.value)} checked={intensity==='extremo'} />
                  <label htmlFor="int-extremo" className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-red-500 peer-checked:border-red-600 peer-checked:text-red-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="block text-sm font-semibold">Extremo</div>
                  </label>
                </li>
              </ul>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Notas del dia / Ejercicios
              </label>
              <textarea 
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Pecho plano 4x10..."
                disabled={!attended}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 flex-1"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex-[2] disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
}
