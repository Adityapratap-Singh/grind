import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';

const Progress = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [activities, setActivities] = useState({});
  const [aiReview, setAiReview] = useState('Click to get your AI-powered weekly performance analysis.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [metricsRes, probsRes, tasksRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/metrics/${user.username}`),
        axios.get(`${process.env.REACT_APP_API_URL}/problems/${user.username}`),
        axios.get(`${process.env.REACT_APP_API_URL}/tasks/${user.username}`)
      ]);

      // Metrics for chart
      const sortedMetrics = metricsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setHistory(sortedMetrics.map(m => ({
        ...m,
        displayDate: new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      })));

      // Activities for heatmap
      const activityMap = {};
      const allActs = [...probsRes.data, ...tasksRes.data.filter(t => t.completed)];
      allActs.forEach(act => {
        const d = new Date(act.date || act.createdAt).toISOString().split('T')[0];
        activityMap[d] = (activityMap[d] || 0) + 1;
      });
      setActivities(activityMap);

    } catch (err) {
      console.log(err);
    }
  };

  const getAIReview = () => {
    setLoading(true);
    setTimeout(() => {
      const weightDiff = history.length > 1 ? (history[history.length - 1].weight - history[0].weight).toFixed(1) : 0;
      setAiReview(`Weekly Analysis: Your weight trend is ${weightDiff <= 0 ? 'downwards' : 'upwards'} by ${Math.abs(weightDiff)}kg. Your consistency in logging metrics is ${history.length > 3 ? 'excellent' : 'improving'}. Keep the focus on the May 12 target!`);
      setLoading(false);
      toast.success("AI Review generated", { icon: '📊' });
    }, 1500);
  };

  const renderHeatmap = () => {
    const startDate = user?.startDate ? new Date(user.startDate) : new Date();
    const boxes = [];
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const count = activities[dateStr] || 0;
      let level = '';
      if (count > 0) level = 'h1';
      if (count > 2) level = 'h2';
      if (count > 4) level = 'h3';
      
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      
      boxes.push(
        <div 
          key={i} 
          className={`hc ${level} ${isToday ? 'ht' : ''}`} 
          title={`${dateStr}: ${count} activities`}
          style={{ width: '9px', height: '9px' }}
        ></div>
      );
    }
    return boxes;
  };

  return (
    <main className="main">
      <div className="page on" id="page-progress">
        <div className="page-title">Progress</div>
        <div className="page-sub">Your 90-day journey at a glance</div>
        
        <div className="g3 gap14">
          <div className="stat" style={{ '--c': 'var(--pu)' }}><div className="stat-l">Entries</div><div className="stat-v">{history.length}</div><div className="stat-s">logs</div></div>
          <div className="stat" style={{ '--c': 'var(--gr)' }}><div className="stat-l">Current</div><div className="stat-v">{history.length > 0 ? history[history.length-1].weight : user?.weight}</div><div className="stat-s">kg</div></div>
          <div className="stat" style={{ '--c': 'var(--go)' }}><div className="stat-l">Target</div><div className="stat-v">{user?.targetWeight || 68}</div><div className="stat-s">kg</div></div>
        </div>

        <div className="card gap14">
          <div className="sec-label">Weight & Waist Trend</div>
          <div style={{ width: '100%', height: 250, marginTop: '15px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--s3)" vertical={false} />
                <XAxis dataKey="displayDate" stroke="var(--t3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--t3)" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ background: 'var(--s2)', border: '1px solid var(--s3)', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="var(--pk)" strokeWidth={3} dot={{ r: 4, fill: 'var(--pk)' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="waist" name="Waist (cm)" stroke="var(--bl)" strokeWidth={2} dot={{ r: 3, fill: 'var(--bl)' }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card gap14">
          <div className="sec-label">90-Day Activity Heatmap</div>
          <div className="hmap" style={{ marginTop: '8px' }}>
            {renderHeatmap()}
          </div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '7px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--t3)' }}>
            Less <div className="hc" style={{ width: '9px', height: '9px' }}></div><div className="hc h1" style={{ width: '9px', height: '9px' }}></div><div className="hc h2" style={{ width: '9px', height: '9px' }}></div><div className="hc h3" style={{ width: '9px', height: '9px' }}></div> More
            <span style={{ marginLeft: 'auto' }}>Blue border = Today</span>
          </div>
        </div>

        <div className="card gap14" style={{ background: 'linear-gradient(135deg,rgba(139,124,248,.07),rgba(61,224,160,.04))' }}>
          <div className="ai-lbl"><span className="ai-dot"></span>AI Weekly Performance Review</div>
          <div className={`ai-out ${loading ? 'loading' : ''}`}>{aiReview}</div>
          <div className="btn-row"><button className="btn btn-ai" onClick={getAIReview}>✦ Weekly Review</button></div>
        </div>
      </div>
    </main>
  );
};

export default Progress;