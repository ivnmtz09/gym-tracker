import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [visualMode, setVisualMode] = useState(() => {
    return localStorage.getItem('visualMode') || 'dark';
  });
  const [accentTheme, setAccentTheme] = useState(() => {
    return localStorage.getItem('accentTheme') || 'azul';
  });

  useEffect(() => {
    localStorage.setItem('visualMode', visualMode);
    document.documentElement.setAttribute('data-theme', visualMode);
  }, [visualMode]);

  useEffect(() => {
    localStorage.setItem('accentTheme', accentTheme);
    document.documentElement.setAttribute('data-accent', accentTheme);
  }, [accentTheme]);

  return (
    <ThemeContext.Provider value={{ visualMode, setVisualMode, accentTheme, setAccentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
