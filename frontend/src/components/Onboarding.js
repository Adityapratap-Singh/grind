import React, { useState } from 'react';
import axios from 'axios';

const Onboarding = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');

  const obNext = (nextStep) => {
    setStep(nextStep);
  };

  const obFinish = async () => {
    if (name.trim().length < 3) {
      alert("Please enter a name with at least 3 characters.");
      setStep(1);
      return;
    }

    const user = {
      username: name.trim(),
      weight: Number(weight)
    }

    try {
      console.log(`Sending user creation request for ${user.username}...`);
      const response = await axios.post('http://localhost:5000/users/add', user);
      console.log('User created successfully:', response.data);
      onFinish(user); // Notify parent component with user data
    } catch (err) {
      console.error('Error creating user:', err);
      // Fallback: Continue with local storage even if backend fails
      console.warn('Backend user creation failed. Proceeding with local storage only.');
      onFinish(user);
    }
  }

  return (
    <div className="onboard-overlay">
      <div className="onboard-card">
        {step === 0 && (
          <div className="onboard-step on">
            <div className="ob-title">Welcome to<br /><em style={{ color: 'var(--pu)' }}>Grind OS</em></div>
            <div className="ob-sub">Your personal command centre for DSA, exams, fitness, and the BMW internship. Let's set you up in 30 seconds.</div>
            <button className="btn btn-primary btn-full" onClick={() => obNext(1)}>Let's go →</button>
          </div>
        )}
        {step === 1 && (
          <div className="onboard-step on">
            <div className="ob-title">Your name?</div>
            <div className="ob-sub">I'll use it to personalise your daily greeting and AI coach messages.</div>
            <input className="ob-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Arjun" autoComplete="off" />
            <button className="btn btn-primary btn-full" onClick={() => obNext(2)}>Next →</button>
          </div>
        )}
        {step === 2 && (
          <div className="onboard-step on">
            <div className="ob-title">Current weight?</div>
            <div className="ob-sub">This sets your starting point. Target is to lose 15–20 kg by 12 May for the wedding.</div>
            <input className="ob-input" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="e.g. 88 (kg)" autoComplete="off" />
            <button className="btn btn-primary btn-full" onClick={() => obNext(3)}>Next →</button>
          </div>
        )}
        {step === 3 && (
          <div className="onboard-step on">
            <div className="ob-title">You're all set.</div>
            <div className="ob-sub">Your 90-day journey starts today. The AI timetable, fitness plan, and study tracker are ready. Open this every morning.</div>
            <button className="btn btn-primary btn-full" onClick={obFinish}>Start Day 1 🚀</button>
          </div>
        )}
        <div className="ob-dots">
          <div className={`ob-dot ${step === 0 ? 'on' : ''}`}></div>
          <div className={`ob-dot ${step === 1 ? 'on' : ''}`}></div>
          <div className={`ob-dot ${step === 2 ? 'on' : ''}`}></div>
          <div className={`ob-dot ${step === 3 ? 'on' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;