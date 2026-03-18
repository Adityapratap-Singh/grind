import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const HomePage = ({ user, onPageChange }) => {
  const [problems, setProblems] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [mood, setMood] = useState('');
  const [quote, setQuote] = useState({ t: 'Loading...', a: '' });
  const [loading, setLoading] = useState(true);

  const QUOTES = [
    { t: "BMW doesn't care about your year drop. They care about what you built during it.", a: "— Your future self" },
    { t: "The pain of discipline is far less than the pain of regret.", a: "— Unknown" },
    { t: "You don't rise to your goals. You fall to your systems.", a: "— James Clear" },
    { t: "Chemistry clears → third year → BMW. One step at a time.", a: "— Your roadmap" },
    { t: "The backbencher who shows up prepared wins every time.", a: "— Every professor ever" },
    { t: "One LeetCode a day keeps the rejection away.", a: "— Dev wisdom" },
    { t: "20 kg by May. One day at a time.", a: "— This tracker" },
    { t: "The year drop is a chapter, not the whole story.", a: "— Unknown" },
    { t: "Understand it. Memorise the formula. Practice the numerical. That's the whole formula.", a: "— Engineering exam strategy" },
    { t: "Showing up for 60 minutes daily beats a 6-hour session once a week.", a: "— Atomic Habits" },
    { t: "You're not behind. You're building momentum.", a: "— Grind OS" },
    { t: "Hard problems today, easy interviews tomorrow.", a: "— Unknown" },
    { t: "Sleep is when muscle grows and memory consolidates. Never skip it.", a: "— Biology" },
    { t: "The best investment you can make before May 12 is in the mirror.", a: "— Fitness coach" },
    { t: "Every push-up is a vote for the person you want to become.", a: "— James Clear" },
  ];

  const PHASES = [
    { n: "Month 1 — Foundations", t: "C++ STL + Core DSA", s: 1, e: 30 },
    { n: "Month 2 — Core DSA", t: "Trees · Graphs · DP", s: 31, e: 60 },
    { n: "Month 3 — Mock Interviews", t: "Revision + Apply", s: 61, e: 90 }
  ];

  const getPhase = (d) => {
    return PHASES.find(p => d >= p.s && d <= p.e) || PHASES[2];
  };

  const daysSince = () => {
    const startDate = user?.startDate ? new Date(user.startDate) : new Date();
    return Math.max(1, Math.floor((new Date() - startDate) / 86400000) + 1);
  };

  useEffect(() => {
    if (user) {
      fetchData();
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [probsRes, tasksRes, examsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/problems/${user.username}`),
        axios.get(`${process.env.REACT_APP_API_URL}/tasks/${user.username}`),
        axios.get(`${process.env.REACT_APP_API_URL}/exams/${user.username}`)
      ]);
      setProblems(probsRes.data);
      setTasks(tasksRes.data);
      setExams(examsRes.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to sync data");
    } finally {
      setLoading(false);
    }
  };

  const handleMood = (m) => {
    setMood(m);
    toast.success("Mood recorded!", { icon: m.split(' ')[0] });
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const toggleTask = async (id, completed) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tasks/update/${id}`, { completed: !completed });
      if (!completed) toast.success("Task completed! +XP", { icon: '⚡' });
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Error updating task");
    }
  };

  const deleteTask = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/delete/${id}`);
      toast.success("Task removed");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Error deleting task");
    }
  };

  const addTask = async (category) => {
    const content = prompt(`New ${category} task:`);
    if (!content) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tasks/add`, {
        content,
        category,
        xp: 10,
        username: user.username
      });
      toast.success("Task added!");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Error adding task");
    }
  };

  const stats = {
    easy: problems.filter(p => p.difficulty === 'easy').length,
    med: problems.filter(p => p.difficulty === 'med').length,
    hard: problems.filter(p => p.difficulty === 'hard').length,
    totalXp: problems.reduce((acc, p) => acc + (p.xp || 0), 0) + tasks.filter(t => t.completed).reduce((acc, t) => acc + (t.xp || 0), 0)
  };

  const xpTarget = 200;
  const levels = ['Noob', 'Learner', 'Coder', 'Pro', 'Elite'];
  const levelIdx = Math.min(levels.length - 1, Math.floor(stats.totalXp / xpTarget));
  const levelName = levels[levelIdx];
  const xpInLevel = stats.totalXp % xpTarget;
  const xpPct = (xpInLevel / xpTarget) * 100;

  const day = daysSince();
  const dayPct = Math.min(100, Math.round((day / 90) * 100));

  const urgentExam = exams.find(ex => {
    const diff = new Date(ex.date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  });

  const allTasksDone = tasks.length > 0 && tasks.every(t => t.completed);

  // Mock chart data based on problems
  const chartData = [
    { name: 'Mon', xp: 40 },
    { name: 'Tue', xp: 65 },
    { name: 'Wed', xp: 45 },
    { name: 'Thu', xp: 90 },
    { name: 'Fri', xp: 120 },
    { name: 'Sat', xp: 80 },
    { name: 'Sun', xp: stats.totalXp % 150 },
  ];

  if (loading && problems.length === 0) {
    return (
      <main className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ai-dot" style={{ width: '20px', height: '20px' }}></div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="page on" id="page-home">
        <div className="page-title">{getGreeting()}, {user?.username || 'Student'}.</div>
        <div className="page-sub">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>

        {urgentExam && (
          <motion.div 
            className="panic-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <div>
              <div className="panic-text">🚨 PANIC MODE: {urgentExam.subject.toUpperCase()} EXAM NEAR</div>
              <div className="panic-sub">Exam on {new Date(urgentExam.date).toLocaleDateString()} — Only {Math.ceil((new Date(urgentExam.date) - new Date()) / 86400000)} days left!</div>
            </div>
            <button className="btn btn-or" style={{ background: 'white', color: 'var(--re)' }} onClick={() => onPageChange('exams')}>Study Now</button>
          </motion.div>
        )}

        {allTasksDone && (
          <motion.div 
            className="card gap14" 
            style={{ background: 'linear-gradient(135deg, var(--gr), var(--pu))', color: 'white', textAlign: 'center' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏆</div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>All Daily Tasks Done!</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>You're outperforming 95% of students today.</div>
          </motion.div>
        )}

        <div className="card gap14">
          <div className="sec-label">Activity Trend</div>
          <div style={{ width: '100%', height: 120, marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--pu)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--pu)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="xp" stroke="var(--pu)" fillOpacity={1} fill="url(#colorXp)" strokeWidth={2} />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  contentStyle={{ background: 'var(--s2)', border: '1px solid var(--s3)', borderRadius: '8px', fontSize: '10px', fontFamily: 'var(--mono)' }}
                  itemStyle={{ color: 'var(--pu)' }}
                  labelStyle={{ color: 'var(--t3)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card gap14">
          <div className="sec-label">How are you today?</div>
          <div className="mood-row">
            {['🔥 Fired up', '😊 Good', '😐 Okay', '😔 Low', '😴 Tired'].map(m => (
              <button 
                key={m} 
                className={`mood-opt ${mood === m ? 'sel' : ''}`}
                onClick={() => handleMood(m)}
              >
                {m}
              </button>
            ))}
          </div>
          {mood && <div className="mood-reply" style={{ color: 'var(--gr)' }}>That's the spirit! Let's get to work.</div>}
        </div>

        <motion.div 
          className="quote-card" 
          onClick={() => {
            setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
            toast("Quote refreshed!", { duration: 1000 });
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="qt">{quote.t}</div>
          <div className="qa">{quote.a}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--t3)', marginTop: '4px' }}>↻ tap to change</div>
        </motion.div>

        <div className="g4 gap14">
          <div className="stat" style={{ '--c': 'var(--or)' }}><div className="stat-l">Streak</div><div className="stat-v">{day}<span style={{ fontSize: '16px' }}>🔥</span></div><div className="stat-s">days</div></div>
          <div className="stat" style={{ '--c': 'var(--gr)' }}><div className="stat-l">Problems</div><div className="stat-v">{problems.length}</div><div className="stat-s">E:{stats.easy} M:{stats.med} H:{stats.hard}</div></div>
          <div className="stat" style={{ '--c': 'var(--go)' }}><div className="stat-l">XP</div><div className="stat-v">{stats.totalXp}</div><div className="stat-s">{levelName}</div></div>
          <div className="stat" style={{ '--c': 'var(--pu)' }}><div className="stat-l">Day</div><div className="stat-v">{day}</div><div className="stat-s">of 90</div></div>
        </div>

        <div className="card gap14">
          <div className="card-head">
            <div><div className="sec-label" style={{ marginBottom: '3px' }}>Phase Progress</div><div className="card-title">{getPhase(day).n}</div></div>
            <span className="pill p-pu">Day {day}</span>
          </div>
          <div className="prog glow"><motion.div className="prog-f" initial={{ width: 0 }} animate={{ width: `${Math.round(((day - getPhase(day).s) / (getPhase(day).e - getPhase(day).s || 1)) * 100)}%` }} transition={{ duration: 1 }}></motion.div></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)' }}><span>Day {getPhase(day).s}</span><span>{Math.round(((day - getPhase(day).s) / (getPhase(day).e - getPhase(day).s || 1)) * 100)}%</span><span>Day {getPhase(day).e}</span></div>
        </div>

        <div className="card gap14">
          <div className="card-head">
            <span style={{ fontSize: '13px', fontWeight: 600 }}>⚡ Level: <span className="pill p-go" style={{ marginLeft: '4px' }}>{levelName}</span></span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--go)' }}>{xpInLevel} / {xpTarget} XP</span>
          </div>
          <div className="prog thick glow"><motion.div className="prog-f" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1 }} style={{ '--c': 'var(--go)' }}></motion.div></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--t3)' }}><span>Noob</span><span>Learner</span><span>Coder</span><span>Pro</span><span>Elite</span></div>
        </div>

        <div className="g2 gap14">
          <div className="card">
            <div className="card-head">
              <div className="sec-label" style={{ marginBottom: 0 }}>DSA Tasks</div>
              <button className="icon-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => addTask('dsa')}>+</button>
            </div>
            <div className="task-list">
              {tasks.filter(t => t.category === 'dsa').map(t => (
                <motion.div 
                  key={t._id} 
                  className={`task ${t.completed ? 'done' : ''}`} 
                  onClick={() => toggleTask(t._id, t.completed)}
                  whileHover={{ x: 5 }}
                >
                  <div className="tcb">{t.completed ? '✓' : ''}</div>
                  <div className="tt">{t.content}</div>
                  <div className="txp">+{t.xp} XP</div>
                  <div className="ni" style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.3 }} onClick={(e) => deleteTask(e, t._id)}>🗑️</div>
                </motion.div>
              ))}
              {tasks.filter(t => t.category === 'dsa').length === 0 && <div className="card-sub">No tasks for today.</div>}
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <div className="sec-label" style={{ marginBottom: 0 }}>Aptitude + Habit</div>
              <button className="icon-btn" style={{ width: '24px', height: '24px', fontSize: '10px' }} onClick={() => addTask('habit')}>+</button>
            </div>
            <div className="task-list">
              {tasks.filter(t => t.category === 'apt' || t.category === 'habit').map(t => (
                <motion.div 
                  key={t._id} 
                  className={`task ${t.completed ? 'done' : ''}`} 
                  onClick={() => toggleTask(t._id, t.completed)}
                  whileHover={{ x: 5 }}
                >
                  <div className="tcb">{t.completed ? '✓' : ''}</div>
                  <div className="tt">{t.content}</div>
                  <div className="txp">+{t.xp} XP</div>
                  <div className="ni" style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.3 }} onClick={(e) => deleteTask(e, t._id)}>🗑️</div>
                </motion.div>
              ))}
              {tasks.filter(t => t.category === 'apt' || t.category === 'habit').length === 0 && <div className="card-sub">No tasks for today.</div>}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="sec-label">Quick Actions</div>
          <div className="btn-row">
            <button className="btn" onClick={() => onPageChange('problems')}>+ Log Problem</button>
            <button className="btn" onClick={() => onPageChange('timetable')}>🕒 Timetable</button>
            <button className="btn" onClick={() => onPageChange('focus')}>⏱️ Focus Timer</button>
            <button className="btn" onClick={() => onPageChange('journal')}>✍️ Journal</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;