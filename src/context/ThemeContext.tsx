import React, { createContext, useState, useEffect } from 'react';
import type { Theme, ThemeContextType } from '../types/context/themeContext';


export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => { }
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedTheme = localStorage.getItem('theme') as Theme;
  const [theme, setTheme] = useState<Theme>(savedTheme || 'dark');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};