import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Mascot from '../components/Mascot';
import { Home, UsersRound, User as UserIcon } from 'lucide-react';

export default function MainLayout({ user, profile }) {
  const displayName = profile?.displayName || user?.email?.split('@')[0];
  const xp = profile?.xp || 0;
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;

  return (
    <div className="flex flex-col min-h-screen bg-transparent pb-20">
      {/* Header Discreto Superior */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mascot size={32} level={level} />
            <h1 className="text-xl font-extrabold tracking-tight">
              Forge<span className="text-[var(--accent-base)]">Fit</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full pl-3 pr-1 py-1 shadow-sm">
            <span className="text-sm font-bold truncate max-w-[120px]">{displayName}</span>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full object-cover ml-1" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold ml-1">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>

      {/* Bottom Navigation Fijo Global */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-surface)]/90 backdrop-blur-2xl border-t border-[var(--border-subtle)] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex justify-around items-center h-16 px-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-[var(--accent-base)] scale-110' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            <Home size={22} className="transition-colors" />
            <span className="text-[10px] font-bold">Inicio</span>
          </NavLink>

          <NavLink 
            to="/community" 
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-[var(--accent-base)] scale-110' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            <UsersRound size={22} className="transition-colors" />
            <span className="text-[10px] font-bold">Comunidad</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-[var(--accent-base)] scale-110' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            <UserIcon size={22} className="transition-colors" />
            <span className="text-[10px] font-bold">Perfil</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
