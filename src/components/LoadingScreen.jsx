import React from 'react';
import Mascot from './Mascot';

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center transition-colors">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <Mascot size={100} className="drop-shadow-2xl animate-bounce" />
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
          Forjando...
        </p>
      </div>
    </div>
  );
}
