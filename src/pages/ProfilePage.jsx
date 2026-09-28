import React, { useState } from 'react';
import { Palette, Moon, Sun, Monitor, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useTheme } from '../contexts/ThemeContext';
import { saveUserProfile } from '../services/db';
import RoutineEditor from '../components/RoutineEditor';
import PersonalRecords from '../components/PersonalRecords';

export default function ProfilePage({ user, profile, onProfileUpdate }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { visualMode, setVisualMode, accentTheme, setAccentTheme } = useTheme();

  const handleThemeChange = async (color) => {
    setAccentTheme(color);
    if (user && profile) {
      await saveUserProfile(user.uid, { ...profile, accentTheme: color });
    }
  };

  const handleModeChange = async (mode) => {
    setVisualMode(mode);
    if (user && profile) {
      await saveUserProfile(user.uid, { ...profile, visualMode: mode });
    }
  };

  const colors = [
    { id: 'azul', label: 'Azul', bg: 'bg-blue-500', hex: '#3b82f6' },
    { id: 'rosa', label: 'Rosa', bg: 'bg-pink-500', hex: '#ec4899' },
    { id: 'verde', label: 'Verde', bg: 'bg-emerald-500', hex: '#10b981' },
    { id: 'morado', label: 'Morado', bg: 'bg-violet-500', hex: '#8b5cf6' },
    { id: 'naranja', label: 'Naranja', bg: 'bg-orange-500', hex: '#f97316' },
    { id: 'rojo', label: 'Rojo', bg: 'bg-red-500', hex: '#ef4444' },
    { id: 'amarillo', label: 'Amarillo', bg: 'bg-yellow-500', hex: '#eab308' },
    { id: 'cian', label: 'Cian', bg: 'bg-cyan-500', hex: '#06b6d4' },
  ];

  const modes = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Oscuro', icon: Moon },
    { id: 'midnight', label: 'Nocturno', icon: Monitor },
  ];

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  const displayName = profile?.displayName || user?.email?.split('@')[0] || "Usuario";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <header>
        <h2 className="text-3xl font-extrabold tracking-tight">Tu Perfil</h2>
        <p className="text-[var(--text-muted)] mt-1">Configuración y apariencia.</p>
      </header>

      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold btn-accent">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{displayName}</h3>
            <p className="text-[var(--text-muted)] font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Apariencia: Modo */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Monitor className="text-[var(--accent-base)]" /> Modo de Visualización
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {modes.map(mode => {
                const Icon = mode.icon;
                const isActive = visualMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all bg-[var(--bg-base)]"
                    style={{ borderColor: isActive ? 'var(--accent-base)' : 'transparent' }}
                  >
                    <div className="p-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <Icon size={24} style={{ color: isActive ? 'var(--accent-base)' : 'var(--text-muted)' }} />
                    </div>
                    <span className="font-bold text-sm" style={{ color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {mode.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apariencia: Color */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Palette className="text-[var(--accent-base)]" /> Tema de Acento
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {colors.map(color => {
                const isActive = accentTheme === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => handleThemeChange(color.id)}
                    className="group relative flex flex-col items-center gap-2 outline-none"
                  >
                    <div 
                      className="w-12 h-12 rounded-full shadow-md transition-all duration-300"
                      style={{ 
                        backgroundColor: color.hex,
                        boxShadow: isActive ? `0 0 0 4px var(--bg-surface), 0 0 0 6px ${color.hex}` : 'none',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />
                    <span className={`text-xs font-bold transition-colors ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <RoutineEditor user={user} profile={profile} onProfileUpdate={onProfileUpdate} />
      <PersonalRecords user={user} profile={profile} onProfileUpdate={onProfileUpdate} />

      <div className="glass-card p-6 border-red-500/20 bg-red-500/5">
        {!showLogoutConfirm ? (
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-red-500 font-bold hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95">
            <p className="text-red-500 font-bold">¿Seguro que deseas salir?</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-[var(--bg-surface)] rounded-xl font-bold border border-[var(--border-subtle)] hover:bg-[var(--bg-base)] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all"
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
