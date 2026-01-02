import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'warm' ? 'pink' : 'warm'} theme`}
    >
      {theme === 'warm' ? '🌸' : '🌿'}
    </button>
  );
}
