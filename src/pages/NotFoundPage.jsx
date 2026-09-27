import React from 'react';
import { Link } from 'react-router-dom';
import Mascot from '../components/Mascot';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center text-center p-4">
      <Mascot size={150} className="mb-8 opacity-50 grayscale" />
      <h1 className="text-6xl font-extrabold text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        ¡Vaya! Te perdiste en el gimnasio.
      </h2>
      <p className="text-foreground/60 mb-8 max-w-md">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link 
        to="/"
        className="btn-accent font-bold rounded-2xl px-8 py-4"
      >
        Volver a Entrenar
      </Link>
    </div>
  );
}
