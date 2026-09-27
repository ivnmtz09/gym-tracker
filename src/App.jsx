import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-semibold text-xl">Cargando...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        {user && (
          <nav className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold tracking-wide">Gym Tracker</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-80">{user.email}</span>
              <button 
                onClick={() => signOut(auth)}
                className="bg-indigo-700 hover:bg-indigo-800 transition-colors px-3 py-1.5 rounded-md text-sm font-medium"
              >
                Salir
              </button>
            </div>
          </nav>
        )}
        <main className="p-4 md:p-8 max-w-5xl mx-auto">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
