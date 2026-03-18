import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import Timetable from './components/Timetable';
import Problems from './components/Problems';
import Fitness from './components/Fitness';
import Syllabus from './components/Syllabus';
import Exams from './components/Exams';
import Focus from './components/Focus';
import Journal from './components/Journal';
import Progress from './components/Progress';
import Badges from './components/Badges';
import Settings from './components/Settings';

function App() {
  const [serverReady, setServerReady] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/health`);
        setServerReady(true);
        console.log("Server is ready.");
      } catch (err) {
        console.log("Server not ready, retrying in 2s...");
        setTimeout(checkServer, 2000);
      }
    };

    checkServer();
  }, []);

  useEffect(() => {
    if (!serverReady) return;

    const storedUser = localStorage.getItem('grind_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Theme persistence
    const savedTheme = localStorage.getItem('grind_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
  }, [serverReady]);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (!serverReady) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--t2)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
        <div className="ai-dot" style={{ width: '12px', height: '12px', marginBottom: '12px' }}></div>
        Connecting to Grind OS Server...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <Toaster position="top-right" />
        <Onboarding onFinish={(userData) => {
          localStorage.setItem('grind_user', JSON.stringify(userData));
          setUser(userData);
        }} />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage user={user} onPageChange={setCurrentPage} />;
      case 'timetable': return <Timetable user={user} />;
      case 'problems': return <Problems user={user} />;
      case 'fitness': return <Fitness user={user} />;
      case 'syllabus': return <Syllabus />;
      case 'exams': return <Exams user={user} />;
      case 'focus': return <Focus user={user} />;
      case 'journal': return <Journal user={user} />;
      case 'progress': return <Progress user={user} />;
      case 'badges': return <Badges user={user} />;
      case 'settings': return <Settings user={user} />;
      default: return <HomePage user={user} onPageChange={setCurrentPage} />;
    }
  };

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'timetable', icon: '📅', label: 'Plan' },
    { id: 'problems', icon: '🧠', label: 'Solve' },
    { id: 'fitness', icon: '💪', label: 'Fit' },
    { id: 'focus', icon: '🍅', label: 'Focus' }
  ];

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--s2)',
            color: 'var(--tx)',
            border: '1px solid var(--b2)',
            fontFamily: 'var(--mono)',
            fontSize: '12px',
          },
        }}
      />
      <div className="shell">
        <Sidebar user={user} currentPage={currentPage} onPageChange={setCurrentPage} />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="mob-nav">
        {navItems.map(item => (
          <button 
            key={item.id} 
            className={`mn-btn ${currentPage === item.id ? 'on' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="mn-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <button 
          className={`mn-btn ${currentPage === 'settings' ? 'on' : ''}`}
          onClick={() => setCurrentPage('settings')}
        >
          <span className="mn-icon">⚙️</span>
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
