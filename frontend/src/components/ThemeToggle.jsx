import React from 'react';
import '../styles/components.css';

function ThemeToggle({ theme, onToggle }) {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;