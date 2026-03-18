import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Badges = ({ user }) => {
  const [stats, setStats] = useState({
    problems: 0,
    tasks: 0,
    metrics: 0,
    xp: 0,
    streak: 0
  });

  const daysSince = () => {
    const startDate = user?.startDate ? new Date(user.startDate) : new Date();
    return Math.max(1, Math.floor((new Date() - startDate) / 86400000) + 1);
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [probs, tasks, metrics, journals] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/problems/${user.username}`),
            axios.get(`${process.env.REACT_APP_API_URL}/tasks/${user.username}`),
            axios.get(`${process.env.REACT_APP_API_URL}/metrics/${user.username}`),
            axios.get(`${process.env.REACT_APP_API_URL}/journal/${user.username}`)
          ]);

          const totalXp = probs.data.reduce((acc, p) => acc + (p.xp || 0), 0) + 
                          tasks.data.filter(t => t.completed).reduce((acc, t) => acc + (t.xp || 0), 0);

          const hardCount = probs.data.filter(p => p.difficulty === 'hard').length;
          const pomoCount = tasks.data.filter(t => t.completed && t.content.includes('Completed')).length;

          setStats({
            problems: probs.data.length,
            hardProblems: hardCount,
            tasks: tasks.data.filter(t => t.completed).length,
            pomodoros: pomoCount,
            journals: journals.data.length,
            metrics: metrics.data.length,
            xp: totalXp,
            streak: daysSince()
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [user]);

  const BADGES_DATA = [
    { id: "d1", i: "🌱", n: "Day One", d: "Started", on: stats.streak >= 1 },
    { id: "s3", i: "🔥", n: "On Fire", d: "3-day streak", on: stats.streak >= 3 },
    { id: "s7", i: "⚡", n: "Grinder", d: "7-day streak", on: stats.streak >= 7 },
    { id: "s14", i: "💎", n: "Two Weeks", d: "14-day streak", on: stats.streak >= 14 },
    { id: "s30", i: "👑", n: "Unstoppable", d: "30-day streak", on: stats.streak >= 30 },
    { id: "p10", i: "🧠", n: "Solver", d: "10 problems", on: stats.problems >= 10 },
    { id: "p25", i: "🎯", n: "Sharp", d: "25 problems", on: stats.problems >= 25 },
    { id: "p50", i: "🚀", n: "LeetCode 50", d: "50 problems", on: stats.problems >= 50 },
    { id: "p100", i: "💯", n: "Century", d: "100 problems", on: stats.problems >= 100 },
    { id: "h10", i: "🔒", n: "Hard Cracker", d: "10 hard problems", on: stats.hardProblems >= 10 },
    { id: "pm5", i: "🍅", n: "Focused", d: "5 Pomodoros", on: stats.pomodoros >= 5 },
    { id: "pm20", i: "🧘", n: "Deep Work", d: "20 Pomodoros", on: stats.pomodoros >= 20 },
    { id: "j5", i: "📓", n: "Reflective", d: "5 journal entries", on: stats.journals >= 5 },
    { id: "fit7", i: "💪", n: "Fit Week", d: "7 workouts", on: stats.metrics >= 7 },
    { id: "fit21", i: "🏃", n: "3-Week Grind", d: "21 workouts", on: stats.metrics >= 21 },
    { id: "lc", i: "💻", n: "Coder", d: "Coder level", on: stats.xp >= 500 },
    { id: "lp", i: "🏆", n: "Pro", d: "Pro level", on: stats.xp >= 1000 },
    { id: "ph2", i: "📈", n: "Phase 2", d: "Entered Month 2", on: stats.streak >= 31 },
    { id: "ph3", i: "🎓", n: "Final Phase", d: "Entered Month 3", on: stats.streak >= 61 },
  ];

  return (
    <main className="main">
      <div className="page on" id="page-badges">
        <div className="page-title">Badges</div>
        <div className="page-sub">Earned by showing up. Gray = locked.</div>
        
        <div className="badge-grid">
          {BADGES_DATA.map((b) => (
            <div key={b.id} className={`badge ${b.on ? 'on' : ''}`}>
              <span className="badge-icon">{b.i}</span>
              <div className="badge-name">{b.n}</div>
              <div className="badge-desc">{b.d}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Badges;