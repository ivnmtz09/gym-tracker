import { useState, useEffect } from 'react';
import { saveUserProfile } from '../services/db';
import { Scale, Edit2, Check, X, Info, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function PhysicalProfile({ user, profile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ height: '', weight: '', goalWeight: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        height: profile.height || '',
        weight: profile.currentWeight || profile.initialWeight || '',
        goalWeight: profile.goalWeight || ''
      });
    }
  }, [profile]);

  const calculateIMC = (weight, height) => {
    if (!weight || !height) return 0;
    const h = height / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const getIMCStatus = (imc) => {
    if (imc < 18.5) return { label: 'Bajo peso', color: 'text-blue-500' };
    if (imc >= 18.5 && imc <= 24.9) return { label: 'Saludable', color: 'text-green-500' };
    if (imc >= 25 && imc <= 29.9) return { label: 'Sobrepeso', color: 'text-orange-500' };
    return { label: 'Obesidad', color: 'text-red-500' };
  };

  const handleSave = async () => {
    setLoading(true);
    
    const weightNum = parseFloat(formData.weight);
    const heightNum = parseFloat(formData.height);
    const imcNum = calculateIMC(weightNum, heightNum);
    
    const currentDate = new Date();
    // Clave para el mes actual ej: "2026-09"
    const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    let history = profile?.weightHistory || [];
    const monthIndex = history.findIndex(h => h.month === currentMonthKey);
    
    const newEntry = { month: currentMonthKey, weight: weightNum, imc: parseFloat(imcNum) };
    
    if (monthIndex >= 0) {
      // Actualiza el registro de este mes
      history[monthIndex] = newEntry;
    } else {
      // Crea un nuevo registro
      history.push(newEntry);
    }

    const updatedProfile = { 
      ...profile, 
      height: heightNum,
      currentWeight: weightNum,
      goalWeight: parseFloat(formData.goalWeight) || null,
      initialImc: parseFloat(imcNum),
      weightHistory: history
    };

    await saveUserProfile(user.uid, updatedProfile);
    onProfileUpdate(updatedProfile);
    setIsEditing(false);
    setLoading(false);
  };

  const currentIMC = calculateIMC(formData.weight, formData.height);
  const status = getIMCStatus(currentIMC);
  
  // Para la gráfica
  const historyData = (profile?.weightHistory || []).map(h => {
    const [year, month] = h.month.split('-');
    const dateObj = new Date(year, month - 1);
    const monthName = dateObj.toLocaleDateString('es-ES', { month: 'short' });
    return {
      name: `${monthName} ${year.slice(2)}`,
      peso: h.weight,
      imc: h.imc
    };
  });

  return (
    <div className="glass-card p-6 sm:p-8 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 text-foreground">
             <Scale className="text-accent" /> Perfil Físico
          </h4>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Tu progreso corporal y metas.
          </p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-xl text-foreground font-semibold transition-colors"
          >
            <Edit2 size={16} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-foreground/5 hover:bg-foreground/10 px-3 py-2 rounded-xl text-foreground font-semibold transition-colors"
            >
              <X size={16} />
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 btn-accent px-4 py-2 rounded-xl font-semibold"
            >
              <Check size={16} /> {loading ? '...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Datos Editables */}
        <div className="bg-foreground/5 p-5 rounded-2xl border border-border flex flex-col gap-2">
          <span className="font-bold text-foreground/60 text-sm">Estatura (cm)</span>
          {isEditing ? (
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              className="bg-background border border-border rounded-lg p-2 font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
            />
          ) : (
            <span className="text-2xl font-extrabold text-foreground">{formData.height || '--'} <span className="text-sm font-medium">cm</span></span>
          )}
        </div>

        <div className="bg-foreground/5 p-5 rounded-2xl border border-border flex flex-col gap-2">
          <span className="font-bold text-foreground/60 text-sm flex items-center gap-2">
            Peso Actual (kg)
          </span>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="bg-background border border-border rounded-lg p-2 font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
            />
          ) : (
            <span className="text-2xl font-extrabold text-foreground">{formData.weight || '--'} <span className="text-sm font-medium">kg</span></span>
          )}
        </div>

        <div className="bg-foreground/5 p-5 rounded-2xl border border-border flex flex-col gap-2 relative overflow-hidden group">
          <span className="font-bold text-foreground/60 text-sm flex items-center gap-2">
            <Target size={16} className="text-accent" /> Peso Meta (kg)
          </span>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              value={formData.goalWeight}
              onChange={(e) => setFormData({...formData, goalWeight: e.target.value})}
              className="bg-background border border-border rounded-lg p-2 font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
              placeholder="Ej: 75.0"
            />
          ) : (
            <span className="text-2xl font-extrabold text-foreground">
              {formData.goalWeight ? formData.goalWeight : '--'} <span className="text-sm font-medium">kg</span>
            </span>
          )}
          
          {/* Indicador de tendencia si hay meta y peso */}
          {!isEditing && formData.goalWeight && formData.weight && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
              {parseFloat(formData.weight) > parseFloat(formData.goalWeight) ? (
                <TrendingDown size={32} className="text-green-500" title="Meta: Perder peso" />
              ) : parseFloat(formData.weight) < parseFloat(formData.goalWeight) ? (
                <TrendingUp size={32} className="text-blue-500" title="Meta: Ganar masa" />
              ) : (
                <Minus size={32} className="text-accent" title="Meta alcanzada" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-background p-6 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-6 items-center mb-8">
        <div className="text-center md:text-left flex-shrink-0">
          <h5 className="font-bold text-foreground mb-1">Tu IMC</h5>
          <div className="flex items-baseline gap-2 justify-center md:justify-start">
            <span className="text-5xl font-black text-foreground">{currentIMC || '--'}</span>
            <span className={`font-bold ${status.color}`}>{status.label}</span>
          </div>
        </div>
        <div className="flex-1 bg-foreground/5 p-4 rounded-2xl border border-border text-sm text-foreground/80 flex gap-3">
          <Info size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <p>
            El <strong>Índice de Masa Corporal (IMC)</strong> es un indicador que relaciona tu peso y estatura. 
            Ayuda a identificar categorías de peso que pueden llevar a problemas de salud. 
            <em> Nota: El IMC no distingue entre grasa y masa muscular, por lo que atletas muy musculosos pueden marcar "Sobrepeso" estando saludables.</em>
          </p>
        </div>
      </div>

      {historyData.length > 0 && (
        <div className="bg-foreground/5 p-6 rounded-3xl border border-border shadow-sm">
          <h5 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-accent" /> Progreso Histórico Mensual
          </h5>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }} 
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']} 
                  tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  name="Peso (kg)"
                  stroke="var(--theme-accent)" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: 'var(--bg-card)', strokeWidth: 3 }}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs font-bold text-foreground/50 mt-4">
            El gráfico se actualiza con el peso registrado en cada mes.
          </p>
        </div>
      )}
    </div>
  );
}
