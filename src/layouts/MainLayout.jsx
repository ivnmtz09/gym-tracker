import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Mascot from '../components/Mascot';
import { Home, UsersRound, User as UserIcon } from 'lucide-react';

export default function MainLayout({ user, profile }) {
  const displayName = profile?.displayName || user?.email?.split('@')[0];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Top Navbar Glassmorphism */}
      <nav className="sticky top-0 z-40 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 shadow-sm transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Mascot size={36} />
              <h1 className="text-xl font-extrabold tracking-tight">
                Forge<span className="text-primary-600 dark:text-primary-400">Fit</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                Dashboard
              </NavLink>
              <NavLink to="/community" className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                Comunidad
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800' : 'bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <span className="text-sm font-bold">{displayName}</span>
                <UserIcon size={16} />
              </NavLink>
            </div>
            {/* Mobile User Tag */}
            <div className="md:hidden">
              <NavLink to="/profile" className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-bold truncate max-w-[100px]">{displayName}</span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Glassmorphism */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 pb-safe">
        <div className="flex justify-around items-center h-16 px-4">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <Home size={24} />
            <span className="text-[10px] font-bold">Inicio</span>
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <UsersRound size={24} />
            <span className="text-[10px] font-bold">Comunidad</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <UserIcon size={24} />
            <span className="text-[10px] font-bold">Perfil</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
