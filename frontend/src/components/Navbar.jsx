import React from 'react';
import { FiSun, FiMoon, FiInfo, FiSearch, FiCpu, FiDatabase, FiCode, FiLayers } from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = ({ searchTerm, setSearchTerm, darkMode, toggleTheme, showAbout, setShowAbout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
      <img src="/logo.png" alt="Kiroscope Logo" className="logo" />
        <div className="brand-text">
          <h1>Kiroscope</h1>
          <span className="tagline">Architecture Intelligence Platform</span>
        </div>
      </div>
      
      <div className="nav-search">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FiSearch className="search-icon" />
        </div>
      </div>

      <div className="nav-actions">
        <button 
          className={`nav-btn ${showAbout ? 'active' : ''}`}
          onClick={() => setShowAbout(!showAbout)}
        >
          <FiInfo className="btn-icon" />
          {showAbout ? 'View Graph' : 'About'}
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;