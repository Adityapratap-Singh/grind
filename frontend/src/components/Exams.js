import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Exams = ({ user }) => {
  const EXAM_SUBJECTS = [
    { id: "chem", name: "Engineering Chemistry", color: "var(--or)" },
    { id: "phy", name: "Engineering Physics", color: "var(--bl)" },
    { id: "bee", name: "Basic Electrical Engg", color: "var(--go)" }
  ];

  const [examDates, setExamDates] = useState({});
  const [aiExam, setAiExam] = useState('Set your exam dates and click below for a personalised preparation strategy.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchExams();
    }
  }, [user]);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/exams/${user.username}`);
      const dates = {};
      res.data.forEach(e => {
        dates[e.subject] = e.date.split('T')[0];
      });
      setExamDates(dates);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load exam dates");
    }
  };

  const saveDates = async () => {
    try {
      const promises = Object.entries(examDates).map(([subject, date]) => 
        axios.post(`${process.env.REACT_APP_API_URL}/exams/add`, {
          username: user.username,
          subject,
          date
        })
      );
      await Promise.all(promises);
      toast.success("Exam dates updated!");
      fetchExams();
    } catch (err) {
      console.log(err);
      toast.error("Error saving exam dates");
    }
  };

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getAIExam = () => {
    setLoading(true);
    setTimeout(() => {
      setAiExam(`Priority: focus on Chemistry first as it has the most backlog. Units 4 & 5 are high-yield. For Physics, dedicate a full Pomodoro to Quantum Mechanics. BEE resonance numericals are a guaranteed 10 marks.`);
      setLoading(false);
      toast("AI strategy generated", { icon: '🎓' });
    }, 1500);
  };

  const updateDate = (id, newDate) => {
    setExamDates({ ...examDates, [id]: newDate });
  };

  return (
    <main className="main">
      <div className="page on" id="page-exams">
        <div className="page-title">Exam Dates</div>
        <div className="page-sub">Set your exam dates — the app will switch to panic mode when they're near</div>
        
        <div className="exam-row">
          {EXAM_SUBJECTS.map(ex => {
            const days = getDaysLeft(examDates[ex.id]);
            const urgent = days !== null && days <= 7;
            return (
              <motion.div 
                key={ex.id} 
                className="exam-card" 
                style={{ borderTop: `3px solid ${ex.color}`, backgroundColor: urgent ? 'rgba(240,80,96,.06)' : 'var(--s2)' }}
                whileHover={{ y: -5 }}
              >
                <div className="exam-subj">{ex.name}</div>
                <div className="exam-days" style={{ color: urgent ? 'var(--re)' : ex.color }}>{days !== null ? days : '--'}</div>
                <div className="exam-lbl">days to go</div>
                {examDates[ex.id] && <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--t3)', marginTop: '4px' }}>{new Date(examDates[ex.id]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>}
              </motion.div>
            );
          })}
        </div>

        <div className="card gap14">
          <div className="sec-label">Set / Update Exam Dates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {EXAM_SUBJECTS.map(ex => (
              <div key={ex.id} className="met-wrap">
                <div className="met-lbl">{ex.name}</div>
                <input 
                  className="met-in" 
                  type="date" 
                  value={examDates[ex.id] || ''} 
                  onChange={(e) => updateDate(ex.id, e.target.value)} 
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            ))}
          </div>
          <div className="btn-row"><button className="btn btn-primary" onClick={saveDates}>Save All Dates</button></div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(139,124,248,.07),rgba(61,224,160,.04))' }}>
          <div className="ai-lbl"><span className="ai-dot"></span>AI Exam Strategy</div>
          <div className={`ai-out ${loading ? 'loading' : ''}`}>{aiExam}</div>
          <div className="btn-row"><button className="btn btn-ai" onClick={getAIExam}>✦ Get Exam Strategy</button></div>
        </div>
      </div>
    </main>
  );
};

export default Exams;