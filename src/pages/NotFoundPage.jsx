import React from 'react';
import { Link } from 'react-router-dom';
import Mascot from '../components/Mascot';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center text-center p-4">
      <Mascot size={150} className="mb-8 opacity-50 grayscale" />
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6">
        ¡Vaya! Te perdiste en el gimnasio.
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link 
        to="/"
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-8 py-3.5 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-800 transition-all shadow-lg"
      >
        Volver a Entrenar
      </Link>
    </div>
  );
}
