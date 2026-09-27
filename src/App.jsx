import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserProfile, saveUserProfile } from './services/db';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import Mascot from './components/Mascot';
import { LogOut, Settings, Moon, Sun, Palette } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Theme States
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState('blue');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
        if (userProfile?.themeColor) setThemeColor(userProfile.themeColor);
        if (userProfile?.darkMode !== undefined) setDarkMode(userProfile.darkMode);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Apply Theme Color
    document.documentElement.setAttribute('data-theme', themeColor);
    
    // Apply Dark Mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeColor, darkMode]);

  const saveSettings = async (updates) => {
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await saveUserProfile(user.uid, newProfile);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    saveSettings({ darkMode: newMode });
  };

  const changeThemeColor = (color) => {
    setThemeColor(color);
    saveSettings({ themeColor: color });
    setShowSettings(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Mascot size={80} />
          <p className="text-xl font-bold text-gray-600 dark:text-gray-300">Cargando ForgeFit...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-primary-100 selection:text-primary-900 flex flex-col transition-colors duration-300">
        {user && (
          <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                  <Mascot size={40} />
                  <h1 className="text-xl font-extrabold tracking-tight">
                    Forge<span className="text-primary-600 dark:text-primary-400">Fit</span>
                  </h1>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                    title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                    title="Temas y Colores"
                  >
                    <Palette size={20} />
                  </button>

                  <span className="hidden sm:block text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">
                    {profile?.displayName || user.email.split('@')[0]}
                  </span>
                  
                  <button 
                    onClick={() => signOut(auth)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Color Palette Modal/Dropdown */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700 animate-in zoom-in-95">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Personalizar ForgeFit</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Elige el color principal de la aplicación:</p>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <button onClick={() => changeThemeColor('blue')} className={`w-12 h-12 rounded-full bg-blue-500 shadow-md flex items-center justify-center transition-transform hover:scale-110 ${themeColor === 'blue' ? 'ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''}`} />
                  <button onClick={() => changeThemeColor('pink')} className={`w-12 h-12 rounded-full bg-pink-500 shadow-md flex items-center justify-center transition-transform hover:scale-110 ${themeColor === 'pink' ? 'ring-4 ring-offset-2 ring-pink-500 dark:ring-offset-gray-800' : ''}`} />
                  <button onClick={() => changeThemeColor('emerald')} className={`w-12 h-12 rounded-full bg-emerald-500 shadow-md flex items-center justify-center transition-transform hover:scale-110 ${themeColor === 'emerald' ? 'ring-4 ring-offset-2 ring-emerald-500 dark:ring-offset-gray-800' : ''}`} />
                  <button onClick={() => changeThemeColor('violet')} className={`w-12 h-12 rounded-full bg-violet-500 shadow-md flex items-center justify-center transition-transform hover:scale-110 ${themeColor === 'violet' ? 'ring-4 ring-offset-2 ring-violet-500 dark:ring-offset-gray-800' : ''}`} />
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Cerrar
                </button>
             </div>
          </div>
        )}

        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route 
              path="/" 
              element={
                !user ? <Navigate to="/login" /> : 
                !profile ? <Onboarding user={user} onComplete={setProfile} /> : 
                <Dashboard user={user} profile={profile} />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
