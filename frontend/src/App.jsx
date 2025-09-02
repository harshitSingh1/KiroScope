import React, { useState } from 'react';
import SimpleGraph from './components/SimpleGraph';
import AboutPage from './components/AboutPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        showAbout={showAbout}
        setShowAbout={setShowAbout}
      />
      
      <main className="main-content">
        {showAbout ? (
          <AboutPage />
        ) : (
          <SimpleGraph searchTerm={searchTerm} />
        )}
      </main>
    </div>
  );
}

export default App;