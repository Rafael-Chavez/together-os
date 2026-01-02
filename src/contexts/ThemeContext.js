import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'warm'
    return localStorage.getItem('together-theme') || 'warm';
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === 'pink') {
      document.documentElement.setAttribute('data-theme', 'pink');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Save to localStorage
    localStorage.setItem('together-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'warm' ? 'pink' : 'warm'));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
