import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserProfile } from './services/db';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import { Dumbbell, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile from firestore
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Dumbbell className="w-12 h-12 text-blue-600" />
          <p className="text-xl font-medium text-slate-600">Cargando Gym Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        {user && (
          <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
                    Gym Tracker
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:block text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {profile?.displayName || user.email.split('@')[0]}
                  </span>
                  <button 
                    onClick={() => signOut(auth)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    title="Cerrar Sesión"
                  >
                    <span className="hidden sm:inline">Salir</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </nav>
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
