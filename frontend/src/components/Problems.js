import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Problems = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [probName, setProbName] = useState('');
  const [diff, setDiff] = useState('med');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiff, setFilterDiff] = useState('all');
  const [aiAdvice, setAiAdvice] = useState('Click below to get personalised advice on what to solve next based on your current level.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProblems();
    }
  }, [user]);

  const fetchProblems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/problems/${user.username}`);
      setProblems(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load problems");
    }
  };

  const logProb = async () => {
    const xpMap = { easy: 15, med: 25, hard: 40 };
    const newProb = {
      name: probName.trim() || 'LeetCode Problem',
      difficulty: diff,
      xp: xpMap[diff],
      username: user.username
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/problems/add`, newProb);
      toast.success(`Problem logged! +${newProb.xp} XP`, {
        icon: '🧠',
        style: {
          borderRadius: '10px',
          background: 'var(--s2)',
          color: 'var(--t1)',
        },
      });
      setProbName('');
      fetchProblems();
    } catch (err) {
      console.log(err);
      toast.error("Error logging problem");
    }
  };

  const deleteProb = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/problems/delete/${id}`);
      toast.success("Problem removed");
      fetchProblems();
    } catch (err) {
      console.log(err);
      toast.error("Error deleting problem");
    }
  };

  const getAIAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      setAiAdvice(`You've been crushing Easy problems! It's time to step up. Try 'Container With Most Water' (Medium) or 'Binary Search Rotated Array' (Medium). These are classic interview favorites.`);
      setLoading(false);
      toast("AI guidance updated", { icon: '✨' });
    }, 1500);
  };

  const stats = {
    easy: problems.filter(p => p.difficulty === 'easy').length,
    med: problems.filter(p => p.difficulty === 'med').length,
    hard: problems.filter(p => p.difficulty === 'hard').length
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = filterDiff === 'all' || p.difficulty === filterDiff;
    return matchesSearch && matchesDiff;
  });

  return (
    <main className="main">
      <div className="page on" id="page-problems">
        <div className="page-title">Problem Tracker</div>
        <div className="page-sub">Log every LeetCode problem by difficulty</div>
        
        <div className="diff-row">
          <motion.div className="diff-card" style={{ borderTop: '2px solid var(--gr)' }} whileHover={{ y: -5 }} onClick={() => setFilterDiff(filterDiff === 'easy' ? 'all' : 'easy')}><div className="diff-n" style={{ color: 'var(--gr)' }}>{stats.easy}</div><div className="diff-l">EASY</div></motion.div>
          <motion.div className="diff-card" style={{ borderTop: '2px solid var(--go)' }} whileHover={{ y: -5 }} onClick={() => setFilterDiff(filterDiff === 'med' ? 'all' : 'med')}><div className="diff-n" style={{ color: 'var(--go)' }}>{stats.med}</div><div className="diff-l">MEDIUM</div></motion.div>
          <motion.div className="diff-card" style={{ borderTop: '2px solid var(--re)' }} whileHover={{ y: -5 }} onClick={() => setFilterDiff(filterDiff === 'hard' ? 'all' : 'hard')}><div className="diff-n" style={{ color: 'var(--re)' }}>{stats.hard}</div><div className="diff-l">HARD</div></motion.div>
          <motion.div className="diff-card" style={{ borderTop: '2px solid var(--pu)' }} whileHover={{ y: -5 }} onClick={() => setFilterDiff('all')}><div className="diff-n" style={{ color: 'var(--pu)' }}>{problems.length}</div><div className="diff-l">TOTAL</div></motion.div>
        </div>

        <div className="card gap14">
          <div className="sec-label">Log a Problem</div>
          <div className="diff-btns">
            {['easy', 'med', 'hard'].map(d => (
              <button 
                key={d}
                className={`diff-btn ${d}-b ${diff === d ? 'sel' : ''}`} 
                onClick={() => setDiff(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)} +{d === 'easy' ? 15 : d === 'med' ? 25 : 40} XP
              </button>
            ))}
          </div>
          <div className="row">
            <input 
              className="met-in" 
              value={probName} 
              onChange={(e) => setProbName(e.target.value)} 
              placeholder="Problem name or link" 
              style={{ flex: 1 }} 
              onKeyPress={(e) => e.key === 'Enter' && logProb()}
            />
            <button className="btn btn-primary" onClick={logProb}>Log It</button>
          </div>
        </div>

        <div className="card gap14">
          <div className="card-head">
            <div className="sec-label">Recent Problems</div>
            <div className="row" style={{ gap: '10px' }}>
              <input 
                className="met-in" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search..." 
                style={{ width: '120px', fontSize: '11px', padding: '6px 10px' }} 
              />
              <select 
                className="met-in" 
                value={filterDiff} 
                onChange={(e) => setFilterDiff(e.target.value)}
                style={{ width: '90px', fontSize: '11px', padding: '6px 10px' }}
              >
                <option value="all">All Diff</option>
                <option value="easy">Easy</option>
                <option value="med">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div id="prob-log" style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredProblems.slice().reverse().map((p, i) => (
              <motion.div 
                key={p._id || i} 
                className="task" 
                style={{ padding: '8px 12px' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="tdiff" style={{ 
                  backgroundColor: p.difficulty === 'easy' ? 'rgba(61,224,160,.12)' : p.difficulty === 'med' ? 'rgba(245,200,66,.12)' : 'rgba(240,80,96,.12)',
                  color: p.difficulty === 'easy' ? 'var(--gr)' : p.difficulty === 'med' ? 'var(--go)' : 'var(--re)',
                  fontFamily: 'var(--mono)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px'
                }}>{p.difficulty}</div>
                <div className="tt">{p.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--t3)', marginRight: '8px' }}>+{p.xp} XP</div>
                <button 
                  className="icon-btn" 
                  style={{ width: '22px', height: '22px', border: 'none', background: 'transparent', opacity: 0.3 }}
                  onClick={() => deleteProb(p._id)}
                >
                  🗑️
                </button>
              </motion.div>
            ))}
            {filteredProblems.length === 0 && <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)', padding: '12px' }}>No problems found.</div>}
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(139,124,248,.07),rgba(61,224,160,.04))' }}>
          <div className="ai-lbl"><span className="ai-dot"></span>AI Problem Guidance</div>
          <div className={`ai-out ${loading ? 'loading' : ''}`}>{aiAdvice}</div>
          <div className="btn-row"><button className="btn btn-ai" onClick={getAIAdvice}>✦ What Should I Solve Next?</button></div>
        </div>
      </div>
    </main>
  );
};

export default Problems;