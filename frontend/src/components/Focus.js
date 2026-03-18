import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Focus = ({ user }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS SESSION');
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      setSessionCount(prev => prev + 1);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = async () => {
    if (mode === 'BREAK' || mode === 'LONG BREAK') {
      toast("Break over! Time to focus.", { icon: '⏰' });
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tasks/add`, {
        username: user.username,
        content: `Completed ${mode} (${Math.round(timeLeft/60)} min)`,
        category: 'habit',
        xp: mode === 'DEEP WORK' ? 30 : 20,
        completed: true
      });
      toast.success(`${mode} Complete! +XP logged.`, { icon: '🔥' });
    } catch (err) {
      console.log(err);
      toast.error("Session completed, but failed to log XP.");
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'FOCUS SESSION' ? 25 * 60 : mode === 'DEEP WORK' ? 45 * 60 : mode === 'BREAK' ? 5 * 60 : 15 * 60);
  };

  const setPomo = (mins, label) => {
    setIsActive(false);
    setMode(label);
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const dashOffset = 364.4 * (1 - timeLeft / (mode === 'FOCUS SESSION' ? 25 * 60 : mode === 'DEEP WORK' ? 45 * 60 : mode === 'BREAK' ? 5 * 60 : 15 * 60));

  return (
    <div className="page on" id="page-focus">
      <div className="page-title">Focus Timer</div>
      <div className="page-sub">Pomodoro · Phone away · Full focus</div>
      
      <div className="card gap14" style={{ textAlign: 'center' }}>
        <div className="pomo-mode">{mode}</div>
        <div className="pomo-ring">
          <svg className="psvg" width="150" height="150" viewBox="0 0 150 150">
            <circle className="parc-bg" cx="75" cy="75" r="58" />
            <circle className="parc" cx="75" cy="75" r="58" strokeDasharray="364.4" strokeDashoffset={dashOffset} />
          </svg>
          <div className="pomo-n">{formatTime(timeLeft)}</div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--t3)', fontFamily: 'var(--mono)', marginBottom: '12px' }}>Choose a session length, then start</div>
        <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button className="btn" onClick={() => setPomo(25, 'FOCUS SESSION')}>25 min</button>
          <button className="btn" onClick={() => setPomo(45, 'DEEP WORK')}>45 min</button>
          <button className="btn" onClick={() => setPomo(5, 'BREAK')}>5 min</button>
          <button className="btn" onClick={() => setPomo(15, 'LONG BREAK')}>15 min</button>
        </div>
        <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          <button className="btn btn-primary" onClick={toggleTimer}>{isActive ? '⏸ Pause' : '▶ Start'}</button>
          <button className="btn" onClick={resetTimer}>↺ Reset</button>
        </div>
        <div id="pomo-dots" style={{ marginBottom: '6px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`pdot ${i < sessionCount % 4 ? 'on' : ''}`}></div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)' }}>Sessions today: <span style={{ color: 'var(--pu)' }}>{sessionCount}</span> · Total: <span style={{ color: 'var(--t2)' }}>{sessionCount}</span></div>
      </div>

      <div className="card gap14">
        <div className="sec-label">Study Ambiance</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a className="music-btn" href="https://www.youtube.com/watch?v=jfKfPfyJRdk" target="_blank" rel="noreferrer">🎵 Lo-fi Hip Hop</a>
          <a className="music-btn" href="https://www.youtube.com/watch?v=n61ULEU7CO0" target="_blank" rel="noreferrer">🌧️ Rain Sounds</a>
          <a className="music-btn" href="https://www.youtube.com/watch?v=sjkrrmBnpGE" target="_blank" rel="noreferrer">🧠 Deep Focus</a>
          <a className="music-btn" href="https://www.youtube.com/watch?v=lTRiuFIWV54" target="_blank" rel="noreferrer">📚 Study Playlist</a>
        </div>
      </div>
    </div>
  );
};

export default Focus;