import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ user, currentPage, onPageChange }) => {
  const [problemCount, setProblemCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weddingDays, setWeddingDays] = useState('--');

  const daysSince = () => {
    const startDate = user?.startDate ? new Date(user.startDate) : new Date();
    return Math.max(1, Math.floor((new Date() - startDate) / 86400000) + 1);
  };

  useEffect(() => {
    if (user) {
      axios.get(`${process.env.REACT_APP_API_URL}/problems/${user.username}`)
        .then(res => setProblemCount(res.data.length))
        .catch(err => console.log(err));
      
      // Streak logic
      setStreak(daysSince());

      // Wedding Countdown
      const wed = new Date('2025-05-12');
      const diff = wed - new Date();
      setWeddingDays(Math.max(0, Math.floor(diff / 86400000)));
    }
  }, [user]);

  const toggleTheme = () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('grind_theme', next);
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-wordmark">Grind <em>OS</em></div>
        <div className="logo-tag">// DSA · EXAMS · FITNESS · GRIND</div>
      </div>
      <div className="nav-sec">
        <div className="nav-lbl">Main</div>
        <button className={`nav-btn ${currentPage === 'home' ? 'on' : ''}`} onClick={() => onPageChange('home')}><span className="ni">🏠</span>Today</button>
        <button className={`nav-btn ${currentPage === 'timetable' ? 'on' : ''}`} onClick={() => onPageChange('timetable')}><span className="ni">📅</span>Timetable</button>
        <button className={`nav-btn ${currentPage === 'problems' ? 'on' : ''}`} onClick={() => onPageChange('problems')}><span className="ni">🧠</span>Problems<span className="nav-badge">{problemCount}</span></button>
        <button className={`nav-btn ${currentPage === 'fitness' ? 'on' : ''}`} onClick={() => onPageChange('fitness')}><span className="ni">💪</span>Fitness</button>
      </div>
      <div className="nav-sec">
        <div className="nav-lbl">Study</div>
        <button className={`nav-btn ${currentPage === 'syllabus' ? 'on' : ''}`} onClick={() => onPageChange('syllabus')}><span className="ni">📚</span>Syllabus</button>
        <button className={`nav-btn ${currentPage === 'exams' ? 'on' : ''}`} onClick={() => onPageChange('exams')}><span className="ni">📆</span>Exam Dates</button>
        <button className={`nav-btn ${currentPage === 'focus' ? 'on' : ''}`} onClick={() => onPageChange('focus')}><span className="ni">🍅</span>Focus Timer</button>
        <button className={`nav-btn ${currentPage === 'journal' ? 'on' : ''}`} onClick={() => onPageChange('journal')}><span className="ni">📓</span>Journal</button>
      </div>
      <div className="nav-sec">
        <div className="nav-lbl">Track</div>
        <button className={`nav-btn ${currentPage === 'progress' ? 'on' : ''}`} onClick={() => onPageChange('progress')}><span className="ni">📊</span>Progress</button>
        <button className={`nav-btn ${currentPage === 'badges' ? 'on' : ''}`} onClick={() => onPageChange('badges')}><span className="ni">🏅</span>Badges</button>
        <button className={`nav-btn ${currentPage === 'settings' ? 'on' : ''}`} onClick={() => onPageChange('settings')}><span className="ni">⚙️</span>Settings</button>
      </div>
      <div className="sb-foot">
        <div className="sb-stat-row">
          <div className="sb-stat"><div className="sb-stat-v">{streak}</div><div className="sb-stat-l">🔥 Streak</div></div>
          <div className="sb-stat"><div className="sb-stat-v">{daysSince()}</div><div className="sb-stat-l">📅 Day</div></div>
          <div className="sb-stat"><div className="sb-stat-v">{weddingDays}</div><div className="sb-stat-l">💍 Wed.</div></div>
        </div>
        <div className="sb-actions">
          <button className="icon-btn" title="Toggle light/dark" onClick={toggleTheme}>🌓</button>
          <button className="icon-btn" title="Use streak freeze">🧊</button>
          <button className="icon-btn" title="Settings" onClick={() => onPageChange('settings')}>⚙️</button>
          <button className="icon-btn" title="Export data" onClick={() => onPageChange('settings')}>💾</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;