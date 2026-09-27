import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Mascot from './Mascot';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10 relative z-10 animate-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="mb-4">
            <Mascot size={130} className="hover:scale-110 transition-transform duration-300 drop-shadow-xl" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
            Forge<span className="text-primary-600 dark:text-primary-400">Fit</span>
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            Forja tu mejor versión, día tras día.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-100 dark:border-red-800/30 text-center font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white p-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar con Google
            </>
          )}
        </button>

      </div>
      
      <p className="mt-8 text-sm text-gray-400 dark:text-gray-500 text-center font-medium">
        &copy; {new Date().getFullYear()} ForgeFit. Todos los derechos reservados.
      </p>
    </div>
  );
}
