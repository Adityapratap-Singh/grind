import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Syllabus = () => {
  const [openUnit, setOpenUnit] = useState(null);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('grind_syllabus_done');
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggleComplete = (subId, unitNum) => {
    const key = `${subId}-${unitNum}`;
    const newCompleted = { ...completed, [key]: !completed[key] };
    setCompleted(newCompleted);
    localStorage.setItem('grind_syllabus_done', JSON.stringify(newCompleted));
    if (!completed[key]) toast.success(`Unit ${unitNum} completed!`, { icon: '📚' });
  };

  const SYLLABUS_DATA = [
    { id: "chem", n: "Engineering Chemistry", icon: "🧪", c: "var(--or)", pill: "p-or", units: [
      { n: 3, t: "Engineering Materials", top: "Speciality polymers: Polycarbonate, PHBV, Polyacetylene (PPV), FRP composites. Nanomaterials: 0D/1D/2D/3D classification, graphene, carbon nanotubes, quantum dots.", bb: "🧠 Polymers = plastic families with superpowers. Polycarbonate = bulletproof glass material. PHBV = eco-friendly. Polyacetylene = conducts electricity. Graphene = 1 atom thick, 200× stronger than steel. Quantum dots = nanoparticles that glow different colors based on size (size controls color). EXAM TIP: Make a table — Polymer | Preparation | Properties | Use. S/V ratio = 6/d for cube. Numericals on that." },
      { n: 4, t: "Fuels", top: "HCV/LCV, Bomb calorimeter, Boy's gas calorimeter. Coal: proximate & ultimate analysis. Petroleum refining fractions. CNG, Hydrogen fuel, Biodiesel, Power alcohol.", bb: "🔥 HCV > LCV always. LCV = HCV − (9H × 2442 kJ/kg). Bomb calorimeter = solid/liquid. Boy's = gas. Coal proximate: M-V-A-FC (moisture, volatile, ash, fixed carbon). Ultimate = elemental (C H N S O). Petroleum fractions by boiling point: petrol < naphtha < kerosene < diesel. EXAM TIP: HCV/LCV numerical is 90% guaranteed. Write that formula 5 times now." },
      { n: 5, t: "Spectroscopic Techniques", top: "UV-Vis: Beer's Law A=εcl, chromophore, auxochrome, 4 spectral shifts. IR: stretching (symmetric/asymmetric) and bending (scissoring/rocking/wagging/twisting). Group region vs fingerprint region.", bb: "🌈 Beer's Law: A = εcl. Chromophore = absorbs color. Bathochromic = red shift (longer λ). Hypsochromic = blue shift. Hyperchromic = higher intensity. Hypochromic = lower intensity. IR stretching = bond length change. Bending = bond angle change. Group region: 4000–1500 cm⁻¹. Fingerprint: below 1500. EXAM TIP: Draw spectrophotometer block diagram. All 4 shift names = 1 mark each, every year." },
      { n: 6, t: "Corrosion Science", top: "Dry corrosion (P-B rule), wet corrosion (hydrogen evolution, oxygen absorption, galvanic cell, concentration cell). Prevention: cathodic/anodic protection, hot dipping, cladding, electroplating, cementation.", bb: "🔧 P-B ratio = volume oxide / volume metal. >1 = protective film forms. Galvanic = two metals + electrolyte = less noble one corrodes. Cathodic protection = sacrifice zinc anode (ships). Hot dipping = galvanising (zinc coating). Electroplating = electric current deposits metal. EXAM TIP: P-B ratio values for Cu, Fe, Al, Mg. Prevention methods table. Electroplating cell diagram." }
    ]},
    { id: "phy", n: "Engineering Physics", icon: "⚛️", c: "var(--bl)", pill: "p-bl", units: [
      { n: 3, t: "Quantum Mechanics", top: "De Broglie hypothesis (λ=h/mv), Heisenberg Uncertainty Principle, wave function & physical significance, Schrödinger equations, particle in rigid/non-rigid box, tunneling effect, quantum computing intro.", bb: "⚛️ De Broglie: λ = h/mv (every particle has a wavelength). Heisenberg: ΔxΔp ≥ h/4π (can't know position AND momentum perfectly at same time). Wave function ψ: |ψ|² = probability density. Particle in box: En = n²h²/8mL² — only specific energies allowed. Tunneling = particle passes through barrier classical physics says is impossible (STM, tunnel diode, alpha decay). EXAM TIP: Energy formula En = n²h²/8mL² derivation is asked every year. Ratios E₁:E₂:E₃ = 1:4:9." },
      { n: 4, t: "Semiconductor Physics", top: "Band theory, effective mass, Fermi-Dirac distribution, Fermi level positions (intrinsic/extrinsic), PN junction band diagram, barrier potential, ideal diode equation, solar cell IV characteristics, Hall effect.", bb: "💡 Conductors: bands overlap. Insulators: gap >3eV. Semiconductors: gap ~1eV. Fermi level = 50% probability of occupation. N-type: Fermi near conduction band. P-type: near valence band. PN junction: depletion region + built-in potential (~0.7V Si). Hall effect: B ⊥ to current I → Hall voltage VH = IB/ned appears sideways. Tells you carrier type and concentration. EXAM TIP: Draw band diagrams for all 3 material types + PN junction. Hall effect derivation is a regular question." },
      { n: 5, t: "Magnetism & Superconductivity", top: "Diamagnetic/paramagnetic/ferromagnetic classification. Superconductivity: zero resistance, Meissner effect, Type I vs II, Josephson effect, SQUID, critical temperature, applications.", bb: "🧲 Diamagnetic (Cu, Bi): weakly repelled, μr<1. Paramagnetic (Al): weakly attracted, μr>1 slightly. Ferromagnetic (Fe, Ni, Co): strongly attracted, has domains. Above Curie temp → paramagnetic. Superconductivity: below Tc → R = exactly 0. Meissner effect = B = 0 inside (field expelled → levitation). Type I = abrupt transition. Type II = two critical fields, gradual (used in MRI machines). EXAM TIP: Meissner B vs T graph. Type I vs II comparison table is guaranteed every year." },
      { n: 6, t: "NDT & Nanotechnology", top: "NDT classification, ultrasonic (pulse-echo, thickness, flaw detection), radiography, acoustic emission. Nanotechnology: quantum confinement, surface-to-volume ratio, optical/electrical/mechanical properties, applications.", bb: "🔍 NDT = check materials without breaking them. Ultrasonic pulse-echo: sound pulse sent → flaw reflects → time measured → distance calculated. Radiography = X-rays through material, denser flaws absorb more → appear on film. Quantum confinement: electrons trapped → discrete energy levels → different properties than bulk. S/V = 6/d for cube — huge at nanoscale → high reactivity. EXAM TIP: Pulse-echo diagram. S/V ratio numerical for different sizes. Advantages of NDT over destructive testing (5 points list)." }
    ]},
    { id: "bee", n: "Basic Electrical Engineering", icon: "⚡", c: "var(--go)", pill: "p-go", units: [
      { n: 3, t: "Single Phase AC Circuits", top: "Pure R, L, C circuits. Series RLC, phasor diagrams, resonance (f₀ = 1/2π√LC), impedance Z = √(R²+(XL-XC)²), active/reactive/apparent power, power factor, admittance.", bb: "⚡ ELI the ICE man: In inductor (L), voltage E leads current I. In capacitor (C), current I leads voltage E. Pure R: in phase. XL = 2πfL, XC = 1/(2πfC). Resonance: XL = XC → Z = R (minimum) → max current. Power triangle: P (W) = true, Q (VAR) = reactive, S (VA) = apparent. PF = P/S = cosφ. EXAM TIP: Draw phasor diagrams for all circuit types. Power triangle. Resonance numericals. These are the main 10-mark questions." },
      { n: 4, t: "Polyphase AC & Transformers", top: "3-phase supply, star (VL=√3·Vph) and delta (IL=√3·Iph) connections, power formula. Transformer: EMF equation E=4.44fNΦm, turns ratio, losses, efficiency, voltage regulation, autotransformer.", bb: "🔌 Star: VL = √3·Vph, IL = Iph. Delta: VL = Vph, IL = √3·Iph. Power = √3·VL·IL·cosφ (same for both!). Transformer EMF: E = 4.44fNΦm. Turns ratio a = N1/N2 = V1/V2 = I2/I1. Max efficiency: copper loss = iron loss. Regulation = (VNL − VFL)/VFL × 100. EXAM TIP: Star/Delta two-column table with all formulas. EMF equation derivation. Efficiency numerical with % load and power factor = standard 10-mark pattern." },
      { n: 5, t: "DC Circuits", top: "Network analysis, ideal/practical sources, star-delta conversion, KVL (ΣV=0), KCL (ΣI=0), loop analysis, Superposition theorem, Thevenin's theorem.", bb: "🔋 KVL: sum of all voltages around closed loop = 0. KCL: sum of currents at node = 0. Superposition: one source at a time, deactivate others (V→short circuit, I→open circuit), add results. Thevenin: (1) Remove load. (2) Find open circuit voltage = Vth. (3) Deactivate sources, find Rth from terminals. (4) Replace with Vth + Rth series + load. EXAM TIP: Thevenin is a 10-mark question in literally every exam. Practice 5 problems step by step until automatic." },
      { n: 6, t: "Work, Power, Energy & Batteries", top: "Temperature coefficient of resistance Rt=R₀(1+αΔT), energy conversions (electrical/mechanical/thermal). Lead acid vs Li-ion batteries: construction, charging/discharging, DOD, series-parallel connections.", bb: "🔋 Rt = R₀(1 + αΔT). Conductors: α positive (R increases with T). Semiconductors: α negative (R decreases). Copper α = 0.00393/°C. P = VI = I²R = V²/R. Energy (kWh) = Pt/3,600,000. Lead acid: 2V/cell, heavy, cheap, used in vehicles. Li-ion: 3.6V/cell, light, no memory effect, phones/EVs. DOD: deeper discharge = shorter battery life. Series: V adds. Parallel: Ah adds. EXAM TIP: Temperature resistance numerical. Lead acid vs Li-ion comparison table. Series/parallel battery problems." }
    ]}
  ];

  const totalUnits = SYLLABUS_DATA.reduce((acc, sub) => acc + sub.units.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((doneCount / totalUnits) * 100);

  const toggleUnit = (id) => {
    setOpenUnit(openUnit === id ? null : id);
  };

  return (
    <main className="main">
      <div className="page on" id="page-syllabus">
        <div className="page-title">Syllabus</div>
        <div className="page-sub">Chemistry · Physics · BEE — Units 3–6 only · Backbencher-proof summaries</div>
        
        <div className="card gap14">
          <div className="card-head">
            <div><div className="sec-label" style={{ marginBottom: '3px' }}>Overall Progress</div><div className="card-title">{doneCount} of {totalUnits} Units Mastered</div></div>
            <span className="pill p-gr">{pct}%</span>
          </div>
          <div className="prog glow"><motion.div className="prog-f" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} style={{ '--c': 'var(--gr)' }}></motion.div></div>
        </div>

        <div id="syl-c">
          {SYLLABUS_DATA.map((subject) => (
            <div key={subject.id} className="syl-sub">
              <div className="syl-hdr" onClick={() => toggleUnit(subject.id)}>
                <div className="syl-hdr-l">
                  <span style={{ fontSize: '18px' }}>{subject.icon}</span>
                  <div className="syl-hdr-name">{subject.n}</div>
                  <span className={`pill ${subject.pill}`} style={{ fontSize: '10px', marginLeft: '8px' }}>Units 3–6</span>
                </div>
                <span style={{ color: 'var(--t3)' }}>{openUnit === subject.id ? '▴' : '▾'}</span>
              </div>
              <div className={`syl-body ${openUnit === subject.id ? 'open' : ''}`}>
                {subject.units.map((unit, i) => {
                  const isDone = completed[`${subject.id}-${unit.n}`];
                  return (
                    <div key={i} className={`unit-b ${isDone ? 'done' : ''}`} style={{ borderLeftColor: subject.c, opacity: isDone ? 0.6 : 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div className="unit-title">Unit {unit.n}: {unit.t}</div>
                        <button 
                          className={`btn ${isDone ? 'btn-gr' : ''}`} 
                          style={{ padding: '4px 8px', fontSize: '10px' }}
                          onClick={(e) => { e.stopPropagation(); toggleComplete(subject.id, unit.n); }}
                        >
                          {isDone ? '✓ Mastered' : 'Mark Done'}
                        </button>
                      </div>
                      <div className="unit-topics">{unit.top}</div>
                      <div className="unit-bb">{unit.bb}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Syllabus;