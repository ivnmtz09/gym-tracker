import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Dumbbell } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-indigo-100 p-3 rounded-full mb-3">
          <Dumbbell className="text-indigo-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isRegistering ? 'Crear cuenta' : 'Iniciar Sesión'}
        </h2>
      </div>
      
      {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          {isRegistering ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
}
