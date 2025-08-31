import React, { useState } from 'react';
import SimpleGraph from './components/SimpleGraph';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/logo.png" alt="Kiroscope Logo" className="logo" />
          <div className="brand-text">
            <h1>Kiroscope</h1>
            <span className="tagline">Architecture Visualization Tool</span>
          </div>
        </div>
        
        <div className="nav-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <SimpleGraph searchTerm={searchTerm} />
      </main>
    </div>
  );
}

export default App;