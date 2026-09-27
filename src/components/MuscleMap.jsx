import Model from 'react-body-highlighter';

export default function MuscleMap({ routineDesc }) {
  // Simple NLP mapping based on description
  const desc = routineDesc.toLowerCase();
  let muscles = [];

  if (desc.includes('pecho')) muscles.push('chest');
  if (desc.includes('hombro')) muscles.push('front-deltoids', 'back-deltoids');
  if (desc.includes('tríceps') || desc.includes('triceps')) muscles.push('triceps');
  if (desc.includes('espalda')) muscles.push('upper-back', 'lower-back');
  if (desc.includes('bíceps') || desc.includes('biceps')) muscles.push('biceps');
  if (desc.includes('pierna') || desc.includes('sentadilla') || desc.includes('cuádriceps')) muscles.push('quadriceps', 'hamstrings', 'calves');
  if (desc.includes('glúteo') || desc.includes('peso muerto')) muscles.push('gluteal', 'hamstrings', 'lower-back');
  if (desc.includes('abdomen') || desc.includes('core')) muscles.push('abs', 'obliques');
  if (desc.includes('cardio') || desc.includes('metcon') || desc.includes('wod')) muscles.push('chest', 'quadriceps', 'hamstrings', 'abs');

  const data = [
    {
      name: 'Entrenamiento de hoy',
      muscles: muscles,
      frequency: 1
    }
  ];

  if (muscles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 font-medium text-sm text-center p-4">
        Mapa muscular no disponible para esta rutina.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-48 w-full overflow-hidden opacity-90 scale-125">
      <Model
        data={data}
        style={{ width: '150px' }}
        highlightedColors={['#2563eb', '#3b82f6', '#60a5fa']}
      />
    </div>
  );
}
