import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Journal = ({ user }) => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState('🔥 Fired up');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [aiReflection, setAiReflection] = useState('Write your entry and click AI Reflection for personalised insight.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/journal/${user.username}`);
      setEntries(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load journal");
    }
  };

  const saveEntry = async () => {
    if (entry.trim()) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/journal/add`, {
          username: user.username,
          text: entry,
          mood: mood
        });
        toast.success("Journal entry saved!");
        setEntry('');
        fetchEntries();
      } catch (err) {
        console.log(err);
        toast.error("Error saving journal");
      }
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/journal/delete/${id}`);
      toast.success("Entry removed");
      fetchEntries();
    } catch (err) {
      console.log(err);
      toast.error("Error deleting entry");
    }
  };

  const getAIReflection = () => {
    if (!entry.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setAiReflection(`It's clear that ${entry.substring(0, 50)}... shows you're engaging deeply with the material. Overcoming the initial resistance to BEE is a major win. Tomorrow, try to connect these AC circuit concepts to the practical transformer units we discussed.`);
      setLoading(false);
      toast("AI reflection updated", { icon: '💭' });
    }, 1500);
  };

  const filteredEntries = entries.filter(j => {
    const matchesSearch = j.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === 'all' || j.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const moods = ['🔥 Fired up', '😊 Good', '😐 Okay', '😔 Low', '😴 Tired'];

  return (
    <main className="main">
      <div className="page on" id="page-journal">
        <div className="page-title">Journal</div>
        <div className="page-sub">Write what you learned, what clicked, what didn't</div>
        
        <div className="card gap14">
          <div className="sec-label">Select Current Mood</div>
          <div className="mood-row" style={{ marginBottom: '14px' }}>
            {moods.map(m => (
              <button 
                key={m} 
                className={`mood-opt ${mood === m ? 'sel' : ''}`}
                onClick={() => setMood(m)}
                style={{ fontSize: '11px' }}
              >
                {m}
              </button>
            ))}
          </div>
          <textarea 
            className="j-area" 
            value={entry} 
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Today I studied... I struggled with... I finally understood... Tomorrow I want to focus on..."
            style={{ marginBottom: '14px' }}
          />
          <div className="btn-row">
            <button className="btn btn-primary" onClick={saveEntry}>Save Entry</button>
            <button className="btn btn-ai" onClick={getAIReflection}>✦ AI Reflection</button>
          </div>
          <div className="ai-wrap"><div className="ai-lbl"><span className="ai-dot"></span>AI insight on today's entry</div><div className={`ai-out ${loading ? 'loading' : ''}`}>{aiReflection}</div></div>
        </div>

        <div className="card-head" style={{ marginTop: '20px' }}>
          <div className="sec-label">Past Entries</div>
          <div className="row" style={{ gap: '10px' }}>
            <input 
              className="met-in" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search journals..." 
              style={{ width: '150px', fontSize: '11px', padding: '6px 10px' }} 
            />
            <select 
              className="met-in" 
              value={filterMood} 
              onChange={(e) => setFilterMood(e.target.value)}
              style={{ width: '110px', fontSize: '11px', padding: '6px 10px' }}
            >
              <option value="all">All Moods</option>
              {moods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div id="j-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredEntries.map((j, i) => (
            <motion.div 
              key={j._id || i} 
              className="j-entry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="j-date">{new Date(j.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — <span style={{ opacity: 0.7 }}>{j.mood}</span></div>
                <button 
                  className="icon-btn" 
                  style={{ width: '22px', height: '22px', border: 'none', background: 'transparent', opacity: 0.3 }}
                  onClick={() => deleteEntry(j._id)}
                >
                  🗑️
                </button>
              </div>
              <div className="j-text">{j.text}</div>
            </motion.div>
          ))}
          {filteredEntries.length === 0 && <div className="card-sub">No entries found. Reflect on your day here.</div>}
        </div>
      </div>
    </main>
  );
};

export default Journal;