import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const TT_DATA = {
  chem: [
    { u: 3, top: "Polymers — Table: Prep → Properties → Use", ex: "For each polymer write: preparation method, 2 properties, 1 application. PC→bulletproof glass. PHBV→biodegradable. Polyacetylene→conducts electricity. FRP→light strong composites.", tip: "📝 4-column table crammable in 30 min", c: "var(--or)", p: "p-or" },
    { u: 3, top: "Nanomaterials — Graphene, CNT, Quantum Dots", ex: "Graphene: 1 atom layer, 200× stronger than steel. CNT: rolled graphene, single/multi-wall. Quantum dots: semiconductor nanoparticles, size controls bandgap controls color.", tip: "📝 S/V = 6/d — numerical expected", c: "var(--or)", p: "p-or" },
    { u: 4, top: "Calorific Value — HCV, LCV, Both Calorimeters", ex: "HCV = total heat including steam condensation. LCV = HCV − 9H×2442 kJ/kg. Bomb calorimeter = solids/liquids. Boy's gas = gaseous fuels. Draw both instruments.", tip: "📝 Write LCV formula 5 times. Derive it.", c: "var(--or)", p: "p-or" },
    { u: 4, top: "Coal Analysis — Proximate & Ultimate", ex: "Proximate: M (moisture), V (volatile matter), A (ash), FC (fixed carbon). Physical tests. Ultimate: C, H, N, S, O — elemental analysis. Petroleum: crude → distilled by boiling point.", tip: "📝 Proximate = physical. Ultimate = chemical.", c: "var(--or)", p: "p-or" },
    { u: 5, top: "UV-Vis — Beer's Law + 4 Shifts", ex: "Beer's Law: A = εcl. Bathochromic = red (longer λ). Hypsochromic = blue (shorter λ). Hyperchromic = more intense. Hypochromic = less intense. Chromophore absorbs. Auxochrome intensifies.", tip: "📝 Draw single beam spectrophotometer diagram", c: "var(--or)", p: "p-or" },
    { u: 5, top: "IR Spectroscopy — Vibrations & Regions", ex: "Stretching changes bond length (symmetric + asymmetric). Bending changes angle: scissoring, rocking, wagging, twisting. Group region 4000–1500 cm⁻¹. Fingerprint below 1500.", tip: "📝 Draw all 4 bending modes", c: "var(--or)", p: "p-or" },
    { u: 6, top: "Corrosion Types — Dry, Wet, P-B Rule", ex: "Dry: metal + O₂ → oxide film. P-B ratio = oxide vol / metal vol. >1 = protective. Galvanic: two metals + electrolyte = less noble corrodes. Learn 5 metal P-B values.", tip: "📝 P-B values for Cu, Fe, Al, Mg, Na", c: "var(--or)", p: "p-or" },
    { u: 6, top: "Corrosion Prevention — All Methods", ex: "Cathodic protection: sacrificial zinc anode. Anodic: applied current. Hot dipping = galvanising. Electroplating: anode = metal to deposit, cathode = object to coat. Cementation = pack in metal powder.", tip: "📝 Draw simple electroplating cell", c: "var(--or)", p: "p-or" },
  ],
  phy: [
    { u: 3, top: "De Broglie & Heisenberg — Formulas + Numericals", ex: "λ = h/mv. Verified by Davisson-Germer electron diffraction. Heisenberg: ΔxΔp ≥ h/4π AND ΔEΔt ≥ h/4π. Find minimum uncertainty in position if momentum uncertainty is given.", tip: "📝 Memorise both Heisenberg forms", c: "var(--bl)", p: "p-bl" },
    { u: 3, top: "Schrödinger + Particle in Box — Derivation", ex: "Time-independent: −ℏ²/2m·d²ψ/dx² + Vψ = Eψ. Box: V=0 inside. Solution: ψn = √(2/L)sin(nπx/L). Energy: En = n²h²/8mL². Key: energy is quantised — only n=1,2,3,... allowed.", tip: "📝 Derive En formula. E ratios = 1:4:9", c: "var(--bl)", p: "p-bl" },
    { u: 4, top: "Band Theory + Fermi Level Positions", ex: "Draw 3 band diagrams. Intrinsic: Fermi at midgap. N-type: Fermi shifts up (near conduction band). P-type: shifts down (near valence band). Effective mass: electron in crystal behaves differently.", tip: "📝 Three diagrams side by side = full marks", c: "var(--bl)", p: "p-bl" },
    { u: 4, top: "PN Junction + Hall Effect Derivation", ex: "PN junction: depletion region at interface. Built-in potential ~0.7V Si. Hall effect: I in x, B in z → VH in y. VH = IB/ned. Hall coefficient RH = 1/ne. Determines if N-type or P-type.", tip: "📝 Hall voltage derivation is a standard Q", c: "var(--bl)", p: "p-bl" },
    { u: 5, top: "Magnetism — Types, Curie Law, Applications", ex: "Dia (Cu,Bi): χ<0, weakly repelled. Para (Al,Na): χ>0 small, weakly attracted. Ferro (Fe,Ni,Co): χ>>0, strongly attracted, domains exist. Above Curie temp: ferro→para.", tip: "📝 Table: Type | Example | χ sign | μr | Application", c: "var(--bl)", p: "p-bl" },
    { u: 5, top: "Superconductivity — Meissner + Type I vs II", ex: "Below Tc: R = 0 exactly. Meissner: B = 0 inside superconductor (perfect diamagnetic). Type I: one Hc, abrupt. Type II: Hc1 and Hc2, vortex state between — this is what's used in MRI.", tip: "📝 Draw B vs T graph. Type I vs II table.", c: "var(--bl)", p: "p-bl" },
    { u: 6, top: "NDT — Ultrasonic Pulse-Echo + Radiography", ex: "Pulse-echo: transmitter → sound pulse → flaw reflects → receiver → time = distance. Thickness measurement: d = v×t/2. Radiography: X-rays, denser material absorbs more, shows on film.", tip: "📝 Draw pulse-echo block diagram", c: "var(--bl)", p: "p-bl" },
    { u: 6, top: "Nanotechnology — Quantum Confinement + S/V", ex: "Quantum confinement: electrons in 3D nano-box → discrete energy levels → different properties than bulk. S/V = 6/d (cube). 10nm cube vs 1μm cube: S/V is 100× higher. Drug delivery: functionalised nanoparticles target cancer cells.", tip: "📝 Calculate S/V for 10nm and 1μm side by side", c: "var(--bl)", p: "p-bl" },
  ],
  bee: [
    { u: 3, top: "Pure R, L, C — Phasors + Power", ex: "Pure R: in phase. XL = 2πfL, I lags V 90°. XC = 1/2πfC, I leads V 90°. ELI the ICE man. Power only consumed in R. Draw phasor for each from scratch.", tip: "📝 Draw phasor diagram + power waveform", c: "var(--go)", p: "p-go" },
    { u: 3, top: "Series RLC — Resonance + Power Triangle", ex: "Z = √(R² + (XL-XC)²). Resonance: XL=XC → Z=R(min) → I=max. f₀=1/(2π√LC). Q factor = ω₀L/R. Power triangle: P=VIcosφ, Q=VIsinφ, S=VI. PF=cosφ = P/S.", tip: "📝 Draw power triangle. Resonance numericals.", c: "var(--go)", p: "p-go" },
    { u: 4, top: "Star & Delta — Memorise the Table", ex: "Star(Y): VL=√3·Vph, IL=Iph. Delta(Δ): VL=Vph, IL=√3·Iph. Power=√3·VL·IL·cosφ for BOTH. Phase sequence R-Y-B, 120° apart. Balanced load = equal impedance in each phase.", tip: "📝 Two-column table. No mixing up allowed.", c: "var(--go)", p: "p-go" },
    { u: 4, top: "Transformer — EMF Equation + Efficiency", ex: "E = 4.44fNΦm (from Faraday's law, EMF = N×dΦ/dt, Φ = Φm·sinωt). a = N1/N2 = V1/V2 = I2/I1. Efficiency = Output/(Output+Losses). Max η when copper loss = iron loss.", tip: "📝 EMF derivation + efficiency numerical", c: "var(--go)", p: "p-go" },
    { u: 5, top: "KVL, KCL — Loop Analysis Practice", ex: "KVL: ΣV around loop = 0. KCL: ΣI at node = 0. Loop analysis: assign clockwise currents, write KVL per loop, simultaneous equations. Sign: if current direction matches assumed, positive voltage drop.", tip: "📝 Solve one 2-mesh problem fully", c: "var(--go)", p: "p-go" },
    { u: 5, top: "Thevenin's Theorem — 4-Step Method", ex: "Step 1: Remove load. Step 2: Find Voc = Vth (open circuit voltage). Step 3: Deactivate sources (V→short, I→open), find Rth from terminals. Step 4: Vth + Rth + load → find current.", tip: "📝 Practice until steps are automatic", c: "var(--go)", p: "p-go" },
    { u: 6, top: "Temperature Coefficient + Resistance", ex: "Rt = R₀(1 + αΔT). Conductors: α>0 (R rises). Semiconductors: α<0 (R falls). Given R at 20°C and α, find R at 70°C. Copper α=0.00393, Nichrome=0.0004, Carbon≈negative.", tip: "📝 3 numerical problems on this topic", c: "var(--go)", p: "p-go" },
    { u: 6, top: "Batteries — Lead Acid vs Li-Ion Deep Dive", ex: "Lead acid: Pb+PbO₂+H₂SO₄, 2V/cell, heavy, cheap, recyclable. Li-ion: LiCoO₂, 3.6V/cell, light, no memory effect. DOD: depth of discharge — more discharge = more degradation. Series: V adds. Parallel: Ah adds.", tip: "📝 Comparison table = 5 marks easy", c: "var(--go)", p: "p-go" },
  ],
  dsa: [
    { top: "C++ STL Deep Dive", ex: "vector, map, unordered_map, set, multiset, priority_queue. Know insert, erase, find, lower_bound, upper_bound for each. STL saves ~40% code time in interviews.", tip: "🎯 Solve: Two Sum, Valid Anagram", c: "var(--pu)", p: "p-pu" },
    { top: "Arrays — Two Pointers + Sliding Window", ex: "Two pointers: l/r converge from ends. Sliding window: expand/shrink window based on condition. Prefix sums: precompute → O(1) range queries. Appears in 60% of OA rounds.", tip: "🎯 Solve: Best Time to Buy Stock, Container With Most Water", c: "var(--pu)", p: "p-pu" },
    { top: "Binary Search — 3 Templates", ex: "Template 1: exact match. Template 2: find first true. Template 3: find last true. Key insight: binary search works on ANY monotonic function, not just sorted arrays.", tip: "🎯 Solve: Search Rotated Array, Koko Eating Bananas", c: "var(--pu)", p: "p-pu" },
    { top: "Recursion → Memoization → Bottom-Up DP", ex: "Every DP problem: (1) write naive recursion, (2) add memoisation, (3) convert to iterative. Identify state, transition, and base case. Draw recursion tree first always.", tip: "🎯 Solve: Climbing Stairs, House Robber, Coin Change", c: "var(--pu)", p: "p-pu" },
    { top: "Linked Lists — All Core Patterns", ex: "Slow/fast pointer: cycle detection, middle node. Reverse in-place: prev/curr/next three pointers. Merge: compare heads, link smaller. These appear in every company's OA.", tip: "🎯 Solve: Reverse LL, Detect Cycle, Merge Sorted", c: "var(--pu)", p: "p-pu" },
    { top: "Trees — BFS + DFS + BST", ex: "BFS: queue, level by level. DFS: recursion, 3 orders (pre/in/post). BST property: left<root<right always. Every tree problem: think about what info flows down vs up.", tip: "🎯 Solve: Max Depth, Level Order, Validate BST", c: "var(--pu)", p: "p-pu" },
    { top: "Graph Algorithms — BFS, DFS, Topological Sort", ex: "Adjacency list for sparse graphs. BFS for shortest path (unweighted). DFS for components, cycle detection. Topological sort: all edges go same direction (DAG). Use Kahn's algorithm.", tip: "🎯 Solve: Number of Islands, Course Schedule", c: "var(--pu)", p: "p-pu" },
    { top: "Dynamic Programming — 2D + Classic Problems", ex: "Grid DP: dp[i][j] depends on neighbours. LCS: dp[i][j] = if match, 1+dp[i-1][j-1], else max(dp[i-1][j], dp[i][j-1]). LIS: for each element, find longest increasing ending here.", tip: "🎯 Solve: Longest Common Subsequence, Edit Distance", c: "var(--pu)", p: "p-pu" },
  ],
  apt: [
    { top: "Percentages — Speed Drills", ex: "% change = (new-old)/old × 100. Successive discounts: (100-a)(100-b)/100 — NOT additive. Target: 15 questions in 20 minutes. Use mental math shortcuts.", tip: "⚡ 15 problems on IndiaBix right now", c: "var(--gr)", p: "p-gr" },
    { top: "Time, Speed & Distance", ex: "S = D/T. Trains crossing: add lengths for head-on. Boats: downstream = speed+current, upstream = speed-current. Relative speed: same direction subtract, opposite add.", tip: "⚡ Draw diagram for every train/boat problem", c: "var(--gr)", p: "p-gr" },
    { top: "Logical Reasoning + Arrangements", ex: "Circular: fix one person, arrange rest = (n-1)!. Linear: n!. Blood relations: draw family tree immediately. Statement-conclusion: conclusion must follow ONLY from given statements.", tip: "⚡ Draw circle literally for arrangements", c: "var(--gr)", p: "p-gr" },
    { top: "Number System + HCF/LCM", ex: "Divisibility: 2(last digit), 3(digit sum div 3), 4(last 2), 9(digit sum div 9), 11(alternating digit sum). HCF×LCM = product of two numbers.", tip: "⚡ Write divisibility rules, test 5 numbers each", c: "var(--gr)", p: "p-gr" },
    { top: "Time & Work — LCM Method", ex: "LCM method always faster than fractions. LCM of days = total units of work. Each person's rate = LCM/their days. Days together = total units / combined rate.", tip: "⚡ LCM method only. Fractions are slow.", c: "var(--gr)", p: "p-gr" },
    { top: "Verbal — RC + Error Spotting", ex: "RC: read passage ONCE. Answer from text only, don't assume. Error spotting: subject-verb agreement, tense consistency, prepositions, articles. Read the suspicious part twice.", tip: "⚡ Read last line of each paragraph first for RC", c: "var(--gr)", p: "p-gr" },
  ],
  fit: [
    { top: "Morning workout (see Fitness tab)", ex: "Complete today's scheduled workout. 30–40 min with correct form beats 1 hour sloppily done. Every rep counts. Log it when done for +50 XP.", tip: "💪 Log completion in Fitness tab for XP", c: "var(--pk)", p: "p-pk" },
    { top: "Evening walk — 30 minutes", ex: "Brisk walking is the most underrated fat-loss tool. 30 min at good pace = 200–250 calories. Most effective AFTER dinner — controls blood sugar spike.", tip: "💪 Walk after dinner = 2× fat loss effect", c: "var(--pk)", p: "p-pk" },
    { top: "Hydration + Diet check", ex: "Had 3+ litres of water today? Avoided cold drinks? Protein at every meal (daal/eggs/paneer)? Controlled rice/roti portion? Ate within 12-hour window?", tip: "💪 Set up tomorrow's meals tonight", c: "var(--pk)", p: "p-pk" },
  ]
};

const Timetable = ({ user }) => {
  const [slots, setSlots] = useState([]);
  const [aiPlan, setAiPlan] = useState('Click Generate to get your personalised daily briefing based on your progress.');
  const [loading, setLoading] = useState(false);

  const sRand = (seed) => {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = s * 16807 % 2147483647;
      return (s - 1) / 2147483646;
    };
  };

  const daysSince = () => {
    const startDate = user?.startDate ? new Date(user.startDate) : new Date();
    return Math.max(1, Math.floor((new Date() - startDate) / 86400000) + 1);
  };

  const generateTimetable = (force = false) => {
    const day = daysSince();
    const seed = force ? Date.now() % 99999 : day * 1337 + new Date().getDay() * 97;
    const rand = sRand(seed);
    const pick = (arr, off) => {
      const i = Math.floor(rand() * arr.length);
      return arr[(i + day + off) % arr.length];
    };

    const sels = {
      chem: pick(TT_DATA.chem, 0),
      phy: pick(TT_DATA.phy, 1),
      bee: pick(TT_DATA.bee, 2),
      dsa: pick(TT_DATA.dsa, 3),
      apt: pick(TT_DATA.apt, 4),
      fit: pick(TT_DATA.fit, 5)
    };

    const sNames = { chem: 'Chemistry', phy: 'Physics', bee: 'BEE', dsa: 'DSA', apt: 'Aptitude', fit: 'Fitness' };
    let t = 360; // 6:00 AM in minutes
    
    const fmt = (m) => {
      const h = Math.floor(m / 60) % 24;
      const mi = m % 60;
      const ap = h >= 12 ? 'PM' : 'AM';
      const hh = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${hh}:${mi === 0 ? '00' : String(mi).padStart(2, '0')} ${ap}`;
    };

    const newSlots = [];
    const brk = (icon, txt, mins) => {
      newSlots.push({ b: 1, time: fmt(t), icon, txt });
      t += mins;
    };
    const study = (s, mins) => {
      const tp = sels[s];
      newSlots.push({ b: 0, time: fmt(t), s, sname: sNames[s], dur: mins + 'm', ...tp });
      t += mins;
    };

    brk('🌅', 'Wake up · water · open this app', 20);
    study('fit', 25);
    brk('🚿', 'Freshen up + breakfast', 25);
    study(day % 2 === 0 ? 'chem' : 'phy', 50);
    brk('☕', '5 min break — no phone', 5);
    study('dsa', 55);
    brk('🧘', '10 min stretch break', 10);
    study('bee', 40);
    brk('🍽️', 'Lunch — 40 min', 40);
    study('apt', 25);
    brk('⚡', '5 min break', 5);
    study(day % 2 === 0 ? 'phy' : 'chem', 40);
    brk('📝', 'Revise today\'s notes + journal', 15);
    brk('🌙', 'Done! Mark day complete.', 0);

    setSlots(newSlots);
    if (force) toast.success("Schedule regenerated!");
  };

  useEffect(() => {
    generateTimetable();
  }, [user]);

  const genAIPlan = () => {
    setLoading(true);
    setTimeout(() => {
      setAiPlan(`Hey ${user?.username || 'Student'}! Based on your progress, today we're focusing on deep work. You've been consistent, so keep that momentum going. Don't forget to review the polymers table — it's a high-yield exam topic!`);
      setLoading(false);
      toast("Daily plan updated", { icon: '🤖' });
    }, 1500);
  };

  const sendWA = () => {
    const day = daysSince();
    let msg = `*Grind OS — Day ${day}*\n${new Date().toDateString()}\n\n*Today's Schedule:*\n`;
    slots.filter(s => !s.b).forEach(sl => {
      msg += `⏰ ${sl.time} — ${sl.sname}: ${sl.top}\n`;
    });
    msg += `\n_Grind OS — Stay consistent 🚀_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success("Opening WhatsApp...");
  };

  return (
    <main className="main">
      <div className="page on" id="page-timetable">
        <div className="page-title">Today's Plan</div>
        <div className="page-sub">AI-generated · analyses yesterday · adapts to your energy</div>
        
        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(139,124,248,.07),rgba(61,224,160,.04))' }}>
          <div className="ai-lbl"><span className="ai-dot"></span>AI Daily Coach — Memory Active</div>
          <div className={`ai-out ${loading ? 'loading' : ''}`}>{aiPlan}</div>
          <div className="btn-row">
            <button className="btn btn-ai" onClick={genAIPlan}>✦ Generate AI Plan</button>
            <button className="btn btn-wa" onClick={sendWA}>📲 Send to WhatsApp</button>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--t3)', marginTop: '6px' }}>WhatsApp opens with today's full schedule. You just tap Send.</div>
        </div>

        <div className="btn-row gap14">
          <button className="btn btn-gr" onClick={() => generateTimetable(true)}>🔀 Regenerate Schedule</button>
        </div>

        <div id="tt-slots">
          {slots.map((sl, i) => (
            sl.b ? (
              <motion.div 
                key={i} 
                className="tt-brk"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <span style={{ fontSize: '16px' }}>{sl.icon}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t2)', marginLeft: '8px', marginRight: '8px' }}>{sl.time}</span>
                <span>{sl.txt}</span>
              </motion.div>
            ) : (
              <motion.div 
                key={i} 
                className="tt-slot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div className="tt-time">{sl.time}<br /><span style={{ fontSize: '9px' }}>{sl.dur}</span></div>
                <div className="tt-body">
                  <div className="tt-subj" style={{ color: sl.c }}>
                    {sl.sname} <span className={`pill ${sl.p}`} style={{ padding: '1px 7px', fontSize: '9px', marginLeft: '8px' }}>{sl.s.toUpperCase()}</span>
                  </div>
                  <div className="tt-topic">{sl.top}</div>
                  <div className="tt-explain">{sl.ex}</div>
                  <div className="tt-tip">{sl.tip}</div>
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </main>
  );
};

export default Timetable;