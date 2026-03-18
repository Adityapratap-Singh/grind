import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Fitness = ({ user }) => {
  const [metrics, setMetrics] = useState({ weight: '', waist: '', sleep: '' });
  const [history, setHistory] = useState([]);
  const [aiFit, setAiFit] = useState('Log metrics and click AI Coach for personalised advice.');
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState({ n: 'Loading...', type: 'Type', pill: 'p-pu', exs: [] });
  const [woDone, setWoDone] = useState(false);
  const [countdown, setCountdown] = useState({ days: '--', hrs: '--', min: '--' });
  const [water, setWater] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`grind_water_${today}`);
    if (saved) setWater(parseInt(saved));
  }, []);

  const updateWater = (val) => {
    const newVal = Math.max(0, Math.min(12, val));
    setWater(newVal);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`grind_water_${today}`, newVal);
    if (newVal === 8) toast.success("Hydration target met!", { icon: '💧' });
  };

  const WORKOUTS = [
    { n: "Upper Body + Cardio", type: "Upper", pill: "p-bl", exs: [{ n: "Jumping Jacks", s: "3 × 40 reps", t: "Warm-up. Get heart rate up before anything else." }, { n: "Wide Push-ups", s: "4 × 12 reps", t: "Chest + shoulders. Elevate feet to make it harder." }, { n: "Diamond Push-ups", s: "3 × 10 reps", t: "Fingers form diamond. Targets triceps hard." }, { n: "Pike Push-ups", s: "3 × 10 reps", t: "V-shape body. Best home shoulder exercise." }, { n: "Plank", s: "3 × 45 seconds", t: "Core. Hips level. Don't let them sag." }, { n: "Brisk Walk / Jog", s: "30 min", t: "Non-negotiable for fat loss. Evening is fine." }] },
    { n: "Lower Body + Core", type: "Lower", pill: "p-or", exs: [{ n: "Bodyweight Squats", s: "4 × 20 reps", t: "Full range. King of lower body exercises." }, { n: "Reverse Lunges", s: "3 × 12 each leg", t: "Gentler on knees than forward lunges." }, { n: "Glute Bridges", s: "4 × 20 reps", t: "Lie on back, feet flat. Squeeze hard at top." }, { n: "Bicycle Crunches", s: "3 × 20 reps", t: "Slow and controlled. Best ab exercise." }, { n: "Mountain Climbers", s: "3 × 30 seconds", t: "Core + cardio combo. Drive knees fast." }, { n: "Calf Raises", s: "3 × 25 reps", t: "Use stair edge for full range of motion." }] },
    { n: "Full Body HIIT", type: "HIIT", pill: "p-re", exs: [{ n: "Burpees", s: "4 × 10 reps", t: "Most effective fat-burner. No shortcuts." }, { n: "Jump Squats", s: "4 × 15 reps", t: "Land softly. Feel the burn." }, { n: "High Knees", s: "3 × 45 seconds", t: "Drive knees above hip level. Arms pump." }, { n: "Push-up to Side Plank", s: "3 × 8 each side", t: "Rotate to side plank after each push-up." }, { n: "Squat Hold", s: "3 × 45 seconds", t: "Sit in squat. Wall behind helps beginners." }, { n: "Cool Down Stretch", s: "10 min", t: "Hips, hamstrings, shoulders. Non-optional." }] },
    { n: "Active Recovery", type: "Recovery", pill: "p-gr", exs: [{ n: "Full body stretching", s: "15 min", t: "Hold each stretch 30+ seconds." }, { n: "30 min slow walk", s: "1 session", t: "Easy pace only. This is not a workout." }, { n: "Surya Namaskar", s: "10 rounds", t: "Great for flexibility and mild cardio." }, { n: "Breathing exercise", s: "5 min", t: "4-7-8: inhale 4s, hold 7s, exhale 8s." }] },
    { n: "Core + Cardio Blast", type: "Core", pill: "p-go", exs: [{ n: "Plank variants", s: "3 × 45s: front, left, right", t: "Side planks are harder — build to them." }, { n: "Russian Twists", s: "3 × 20 reps", t: "Hold water bottle for resistance." }, { n: "Leg Raises", s: "3 × 15 reps", t: "Lower slowly. Don't drop them." }, { n: "V-ups", s: "3 × 12 reps", t: "Touch toes at top. Advanced move." }, { n: "Jump Rope / Shadow Jump", s: "10 min intervals", t: "Best cardio. ~12 cal/min burned." }, { n: "Chair Step-ups", s: "3 × 15 each leg", t: "Legs + light cardio together." }] },
    { n: "Push + Pull (Upper)", type: "Push/Pull", pill: "p-pu", exs: [{ n: "Wide + Diamond Push-ups", s: "4 × 10 each", t: "Two variations back to back." }, { n: "Inverted Rows", s: "3 × 12 reps", t: "Under a table — back and biceps." }, { n: "Shoulder Taps", s: "3 × 20 taps", t: "Plank position. Don't rotate hips." }, { n: "Superman Holds", s: "3 × 12 reps", t: "Face down, lift arms + legs. 3s hold." }, { n: "Tricep Dips", s: "3 × 15 reps", t: "Use a sturdy chair." }, { n: "Brisk Walk", s: "20 min", t: "Staircase works too." }] },
    { n: "Rest Day", type: "Rest", pill: "p-gr", exs: [{ n: "Complete Rest", s: "Today", t: "Rest is when muscle actually grows." }, { n: "Light walk (optional)", s: "20 min", t: "Easy pace only. Not a workout." }, { n: "Meal prep", s: "30 min", t: "Set up tomorrow's meals tonight." }, { n: "8 hours sleep", s: "Tonight", t: "Growth hormone released during deep sleep." }] }
  ];

  const updateCountdown = () => {
    const wed = new Date('2025-05-12');
    const diff = wed - new Date();
    const days = Math.max(0, Math.floor(diff / 86400000));
    const hrs = Math.max(0, Math.floor((diff % 86400000) / 3600000));
    const min = Math.max(0, Math.floor((diff % 3600000) / 60000));
    setCountdown({ days, hrs, min });
  };

  const daysSince = () => {
    const startDate = user?.startDate ? new Date(user.startDate) : new Date();
    return Math.max(1, Math.floor((new Date() - startDate) / 86400000) + 1);
  };

  useEffect(() => {
    if (user) {
      fetchMetrics();
      const day = daysSince();
      setWorkout(WORKOUTS[day % 7]);
      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/metrics/${user.username}`);
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logMet = async () => {
    if (!metrics.weight) return toast.error("Weight is required");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/metrics/add`, {
        weight: parseFloat(metrics.weight),
        waist: parseFloat(metrics.waist) || 0,
        sleep: parseFloat(metrics.sleep) || 0,
        username: user.username
      });
      toast.success("Metrics saved!");
      fetchMetrics();
      setMetrics({ weight: '', waist: '', sleep: '' });
    } catch (err) {
      console.log(err);
      toast.error("Error saving metrics");
    }
  };

  const getAIFit = () => {
    setLoading(true);
    setTimeout(() => {
      setAiFit(`You're making progress! To hit your 68kg target by May 12, focus on high-protein Indian foods like daal, paneer, and eggs. Consistency in your daily brisk walks will accelerate fat loss.`);
      setLoading(false);
      toast("AI analysis complete", { icon: '🏃' });
    }, 1500);
  };

  const weightLost = history.length >= 2 ? (history[0].weight - history[history.length - 1].weight) : 0;
  const target = 68;
  const totalToLose = (user?.weight || 85) - target;
  const pct = totalToLose > 0 ? Math.min(100, Math.max(0, Math.round(weightLost / totalToLose * 100))) : 0;

  return (
    <main className="main">
      <div className="page on" id="page-fitness">
        <div className="page-title">Fitness</div>
        <div className="page-sub">No gym · Fat loss + Muscle · Wedding: 12 May</div>

        <div className="wed-card">
          <div className="wed-title">🎊 Chacha's Wedding Countdown</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
            <div><div className="wed-days">{countdown.days}</div><div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', marginTop: '2px' }}>days to go</div></div>
            <div className="wed-units">
              <div className="wed-unit"><div className="wed-unit-n">{countdown.hrs}</div><div className="wed-unit-l">HRS</div></div>
              <div className="wed-unit"><div className="wed-unit-n">{countdown.min}</div><div className="wed-unit-l">MIN</div></div>
            </div>
          </div>
          <div className="proj-bar">
            <div className="proj-lbl"><span>Progress to target: {pct}%</span><span style={{ color: 'var(--pk)' }}>Target: 68kg</span></div>
            <div className="prog" style={{ height: '6px' }}><motion.div className="prog-f" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} style={{ '--c': 'var(--pk)' }}></motion.div></div>
          </div>
        </div>

        <div className="card gap14">
          <div className="sec-label">Water Tracker</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                onClick={() => updateWater(i + 1)}
                style={{ 
                  cursor: 'pointer', 
                  fontSize: '20px', 
                  opacity: i < water ? 1 : 0.15,
                  filter: i < water ? 'none' : 'grayscale(1)',
                  transition: '0.2s'
                }}
              >
                💧
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--t3)' }}>
              {water} / 8+ glasses
            </div>
          </div>
        </div>

        <div className="card gap14">
          <div className="sec-label">Today's Metrics</div>
          <div className="body-metrics">
            <div className="met-wrap"><div className="met-lbl">Weight (kg)</div><input className="met-in" type="number" value={metrics.weight} onChange={(e) => setMetrics({ ...metrics, weight: e.target.value })} placeholder="85" /></div>
            <div className="met-wrap"><div className="met-lbl">Waist (cm)</div><input className="met-in" type="number" value={metrics.waist} onChange={(e) => setMetrics({ ...metrics, waist: e.target.value })} placeholder="92" /></div>
            <div className="met-wrap"><div className="met-lbl">Sleep (hrs)</div><input className="met-in" type="number" value={metrics.sleep} onChange={(e) => setMetrics({ ...metrics, sleep: e.target.value })} placeholder="7" /></div>
          </div>
          <div className="btn-row">
            <button className="btn btn-gr" onClick={logMet}>Save Metrics</button>
            <button className="btn btn-ai" onClick={getAIFit}>✦ AI Coach</button>
          </div>
          <div className="ai-wrap"><div className="ai-lbl"><span className="ai-dot"></span>AI Fitness Coach</div><div className={`ai-out ${loading ? 'loading' : ''}`}>{aiFit}</div></div>
        </div>

        <div className="card gap14">
          <div className="card-head">
            <div><div className="sec-label" style={{ marginBottom: '2px' }}>Today's Workout</div><div className="card-title">{workout.n}</div></div>
            <span className={`pill ${workout.pill}`}>{workout.type}</span>
          </div>
          <div>
            {workout.exs.map((ex, i) => (
              <motion.div 
                key={i} 
                className="ex-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="ex-num">{i + 1}</div>
                <div className="ex-body">
                  <div className="ex-name">{ex.n}</div>
                  <div className="ex-sets">{ex.s}</div>
                  <div className="ex-note">{ex.t}</div>
                </div>
                <div 
                  className={`ex-done ${woDone ? 'on' : ''}`} 
                  onClick={() => {
                    setWoDone(!woDone);
                    if (!woDone) toast.success("Exercise marked done!", { icon: '💪' });
                  }}
                >
                  {woDone ? '✓' : ''}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="btn-row">
            <button className="btn btn-gr" onClick={() => {
              setWoDone(true);
              toast.success("Workout complete! +50 XP", { icon: '🔥' });
            }}>✓ Workout Complete (+50 XP)</button>
          </div>
        </div>

        <div className="card gap14">
          <div className="sec-label">Diet Guide — Indian Foods, No Gym</div>
          <div className="g2">
            <div style={{ background: 'rgba(61,224,160,.06)', border: '1px solid rgba(61,224,160,.14)', borderRadius: 'var(--r12)', padding: '12px 14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gr)', marginBottom: '6px' }}>✅ Eat More</div>
              <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.7' }}>Daal, chole, rajma · Boiled eggs · Paneer (small) · Oats, poha, whole wheat roti · All vegetables · Curd, buttermilk · Fruits (morning) · 3–4L water daily</div>
            </div>
            <div style={{ background: 'rgba(240,80,96,.06)', border: '1px solid rgba(240,80,96,.14)', borderRadius: 'var(--r12)', padding: '12px 14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--re)', marginBottom: '6px' }}>❌ Cut These</div>
              <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.7' }}>Cold drinks · Fried snacks · Excess white rice · Maida products · Sweets · Eating after 9 PM · Skipping breakfast · Packaged juice</div>
            </div>
          </div>
          <div style={{ background: 'rgba(245,200,66,.06)', border: '1px solid rgba(245,200,66,.14)', borderRadius: 'var(--r12)', padding: '12px 14px', marginTop: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--go)', marginBottom: '6px' }}>🍽️ Meal Timing</div>
            <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: '1.85' }}>
              <strong>6 AM</strong> — Warm water + lemon + 5 soaked almonds<br />
              <strong>8 AM</strong> — Oats/poha/2 eggs + 1 whole wheat roti<br />
              <strong>11 AM</strong> — 1 fruit + curd<br />
              <strong>1 PM</strong> — 2 chapati + sabzi + daal + big salad<br />
              <strong>4 PM</strong> — Buttermilk or green tea + roasted chana<br />
              <strong>7 PM</strong> — Light: 1–2 chapati + sabzi / khichdi<br />
              <strong>9 PM</strong> — Glass of milk (if hungry)
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Fitness;