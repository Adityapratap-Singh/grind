import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = ({ user }) => {
  const [profile, setProfile] = useState({
    username: user?.username || '',
    weight: user?.weight || '',
    targetWeight: user?.targetWeight || 68,
    startDate: user?.startDate ? new Date(user.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const saveProfile = async () => {
    try {
      await axios.post(`http://localhost:5000/users/update/${user.username}`, profile);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('grind_user', JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Error updating profile");
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, date: new Date() }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `grind_os_${user.username}_backup.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Data exported!");
  };

  const resetData = () => {
    toast((t) => (
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>
        Reset everything?
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('grind_user');
              window.location.reload();
              toast.dismiss(t.id);
            }}
            style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--re)', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            Reset
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--s3)', border: 'none', color: 'var(--t1)', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.user && data.user.username) {
          localStorage.setItem('grind_user', JSON.stringify(data.user));
          toast.success("Backup imported! Reloading...", { icon: '🔄' });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error("Invalid backup file format");
        }
      } catch (err) {
        toast.error("Error parsing backup file");
      }
    };
    reader.readAsText(file);
  };

  const toggleTheme = () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('grind_theme', next);
    toast(`Switched to ${next} mode`, { icon: next === 'dark' ? '🌙' : '☀️' });
  };

  return (
    <main className="main">
      <div className="page on" id="page-settings">
        <div className="page-title">Settings</div>
        <div className="page-sub">Customise your Grind OS</div>

        <div className="card gap14">
          <div className="sec-label">Your Profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="met-wrap"><div className="met-lbl">Your Name</div><input className="met-in" value={profile.username} disabled style={{ opacity: 0.6 }} /></div>
            <div className="met-wrap"><div className="met-lbl">Current Weight (kg)</div><input className="met-in" type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} placeholder="88" /></div>
            <div className="met-wrap"><div className="met-lbl">Target Weight (kg)</div><input className="met-in" type="number" value={profile.targetWeight} onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value })} placeholder="68" /></div>
            <div className="met-wrap"><div className="met-lbl">Journey Start Date</div><input className="met-in" type="date" value={profile.startDate} onChange={(e) => setProfile({ ...profile, startDate: e.target.value })} style={{ colorScheme: 'dark' }} /></div>
          </div>
          <div className="btn-row"><button className="btn btn-primary" onClick={saveProfile}>Save Profile</button></div>
        </div>

        <div className="card gap14">
          <div className="sec-label">Appearance</div>
          <div className="btn-row">
            <button className="btn" onClick={toggleTheme}>🌓 Toggle Light / Dark Mode</button>
          </div>
        </div>

        <div className="card gap14">
          <div className="sec-label">Data Management</div>
          <div className="export-btns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button className="btn btn-gr" onClick={exportData}>💾 Export Backup</button>
            <label className="btn btn-or" style={{ cursor: 'pointer', justifyContent: 'center' }}>
              📂 Import Backup
              <input type="file" hidden accept=".json" onChange={importData} />
            </label>
            <button className="btn" style={{ color: 'var(--re)', borderColor: 'rgba(240,80,96,.3)', gridColumn: 'span 2' }} onClick={resetData}>↺ Reset All Data</button>
          </div>
        </div>

        <div className="card gap14">
          <div className="sec-label">About</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)', lineHeight: '1.7' }}>
            Grind OS v4.2 — Enhanced MERN Edition<br />
            Built for your 90-day sprint 💪<br />
            Features: DSA Tracker, Activity Heatmap, Exam Panic Mode, AI Coach
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;