import React, { useState } from 'react';
import { Palette, Moon, Sun, Monitor, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

export default function ProfilePage({ user, profile, onProfileUpdate, currentTheme, onThemeChange, currentMode, onModeChange }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const colors = [
    { id: 'blue', label: 'Azul', bg: 'bg-blue-500', ring: 'ring-blue-500' },
    { id: 'pink', label: 'Rosa', bg: 'bg-pink-500', ring: 'ring-pink-500' },
    { id: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { id: 'violet', label: 'Violeta', bg: 'bg-violet-500', ring: 'ring-violet-500' },
    { id: 'orange', label: 'Naranja', bg: 'bg-orange-500', ring: 'ring-orange-500' },
    { id: 'red', label: 'Rojo', bg: 'bg-red-500', ring: 'ring-red-500' },
    { id: 'yellow', label: 'Amarillo', bg: 'bg-yellow-500', ring: 'ring-yellow-500' },
    { id: 'cyan', label: 'Cian', bg: 'bg-cyan-500', ring: 'ring-cyan-500' },
  ];

  const modes = [
    { id: 'light', label: 'Claro', icon: Sun, bg: 'bg-gray-100 text-gray-800' },
    { id: 'dark', label: 'Oscuro', icon: Moon, bg: 'bg-gray-800 text-gray-200' },
    { id: 'night', label: 'Nocturno', icon: Monitor, bg: 'bg-blue-950 text-blue-200' },
  ];

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  const displayName = profile?.displayName || user?.email?.split('@')[0];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <header>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Tu Perfil</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Personaliza tu experiencia en ForgeFit.</p>
      </header>

      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-sm border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/30">
            {displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Apariencia: Modo */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Monitor className="text-primary-500" /> Modo de Visualización
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {modes.map(mode => {
                const Icon = mode.icon;
                const isActive = currentMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${isActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' : 'border-transparent bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                  >
                    <div className={`p-3 rounded-full ${mode.bg}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`font-bold ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}`}>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apariencia: Color */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="text-primary-500" /> Tema de Acento
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {colors.map(color => {
                const isActive = currentTheme === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => onThemeChange(color.id)}
                    className={`group relative flex flex-col items-center gap-2 outline-none`}
                  >
                    <div className={`w-12 h-12 rounded-full ${color.bg} shadow-md transition-all duration-300 ${isActive ? `ring-4 ring-offset-2 ${color.ring} dark:ring-offset-gray-900 scale-110` : 'hover:scale-110'}`} />
                    <span className={`text-xs font-bold transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100'}`}>
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50/50 dark:bg-red-900/10 backdrop-blur-md p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
        {!showLogoutConfirm ? (
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95">
            <p className="text-red-800 dark:text-red-300 font-bold">¿Seguro que deseas salir?</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-white dark:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30"
              >
                Sí, salir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
