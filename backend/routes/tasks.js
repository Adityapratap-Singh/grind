const router = require('express').Router();
let Task = require('../models/task.model');

router.route('/:username').get(async (req, res) => {
  const { username } = req.params;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    let tasks = await Task.find({ 
      username,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // If no tasks for today, generate them based on grind.html logic
    if (tasks.length === 0) {
      const User = require('../models/user.model');
      const user = await User.findOne({ username });
      const startDate = user?.startDate || new Date();
      const dayCount = Math.max(1, Math.floor((new Date() - startDate) / 86400000) + 1);
      const weekIndex = Math.floor((dayCount - 1) / 7);
      
      const DSA_TASKS=[
        ["Revise yesterday's code (20 min)","Solve 2 LeetCode problems","Study today's topic concept","Write key ideas on paper"],
        ["Solve 1 medium LeetCode","Revisit 1 hard problem with hints","Study week's pattern deeply","1 easy for confidence"],
        ["3 timed problems (45 min)","1 mock interview round","Revise 5 weakest topics","Apply to 2 internships"]
      ];
      const APT_BANK=[
        ["20 min IndiaBix quant","Revise yesterday's formulas","1 logical reasoning set","5-min speed test"],
        ["10 percentage problems","Seating arrangement set","Blood relations quiz","1 English article (verbal)"],
        ["Full 30-min mock test","Time & Work problems","Data interpretation set","Error spotting (verbal)"]
      ];

      const phaseIdx = Math.min(2, Math.floor((dayCount - 1) / 30));
      const todayDsa = DSA_TASKS[phaseIdx];
      const todayApt = APT_BANK[phaseIdx];

      const TT_DSA = [
        { top: "C++ STL Deep Dive", ex: "vector, map, unordered_map, set, multiset, priority_queue. Know insert, erase, find, lower_bound, upper_bound for each.", tip: "🎯 Solve: Two Sum, Valid Anagram" },
        { top: "Arrays — Two Pointers + Sliding Window", ex: "Two pointers: l/r converge from ends. Sliding window: expand/shrink window based on condition.", tip: "🎯 Solve: Best Time to Buy Stock, Container With Most Water" },
        { top: "Binary Search — 3 Templates", ex: "Template 1: exact match. Template 2: find first true. Template 3: find last true.", tip: "🎯 Solve: Search Rotated Array, Koko Eating Bananas" },
        { top: "Recursion → Memoization → Bottom-Up DP", ex: "Naive recursion → add memoisation → convert to iterative. Identify state, transition, and base case.", tip: "🎯 Solve: Climbing Stairs, House Robber, Coin Change" },
        { top: "Linked Lists — All Core Patterns", ex: "Slow/fast pointer: cycle detection, middle node. Reverse in-place: prev/curr/next three pointers.", tip: "🎯 Solve: Reverse LL, Detect Cycle, Merge Sorted" },
        { top: "Trees — BFS + DFS + BST", ex: "BFS: level by level. DFS: recursion (pre/in/post). BST property: left<root<right always.", tip: "🎯 Solve: Max Depth, Level Order, Validate BST" },
        { top: "Graph Algorithms — BFS, DFS, Topological Sort", ex: "Adjacency list for sparse graphs. BFS for shortest path. DFS for components, cycle detection.", tip: "🎯 Solve: Number of Islands, Course Schedule" },
        { top: "Dynamic Programming — 2D + Classic Problems", ex: "Grid DP, LCS, LIS. Think about state and transitions.", tip: "🎯 Solve: Longest Common Subsequence, Edit Distance" }
      ];

      const TT_APT = [
        { top: "Percentages — Speed Drills", ex: "% change = (new-old)/old × 100. Successive discounts: (100-a)(100-b)/100.", tip: "⚡ 15 problems on IndiaBix right now" },
        { top: "Time, Speed & Distance", ex: "S = D/T. Trains crossing, Boats: downstream/upstream. Relative speed.", tip: "⚡ Draw diagram for every train/boat problem" },
        { top: "Logical Reasoning + Arrangements", ex: "Circular: (n-1)!. Linear: n!. Family tree for relations.", tip: "⚡ Draw circle literally for arrangements" },
        { top: "Number System + HCF/LCM", ex: "Divisibility rules, HCF×LCM = product of two numbers.", tip: "⚡ Write divisibility rules, test 5 numbers each" },
        { top: "Time & Work — LCM Method", ex: "LCM of days = total units. Rate = LCM/days. Days = units/combined rate.", tip: "⚡ LCM method only. Fractions are slow." },
        { top: "Verbal — RC + Error Spotting", ex: "Read RC once. Error spotting: subject-verb, tense, prepositions.", tip: "⚡ Read last line of each paragraph first for RC" }
      ];

      const TT_FIT = [
        "Upper Body + Cardio (Push-ups, Plank, Jog)",
        "Lower Body + Core (Squats, Lunges, Mountain Climbers)",
        "Full Body HIIT (Burpees, Jump Squats, High Knees)",
        "Active Recovery (Stretching, Surya Namaskar, Walk)",
        "Core + Cardio Blast (Russian Twists, Leg Raises, Jump Rope)",
        "Push + Pull Upper (Diamond Push-ups, Inverted Rows, Dips)"
      ];

      const currentDsaTopic = TT_DSA[(dayCount - 1) % TT_DSA.length];
      const currentAptTopic = TT_APT[(dayCount - 1) % TT_APT.length];
      const currentWorkout = TT_FIT[(dayCount - 1) % TT_FIT.length];

      const defaultTasks = [
        ...todayDsa.map(t => ({ content: t, category: 'dsa', username, xp: 25 })),
        ...todayApt.map(t => ({ content: t, category: 'apt', username, xp: 10 })),
        { content: 'Drink 3L Water', category: 'habit', username, xp: 5 },
        { content: `Workout: ${currentWorkout}`, category: 'habit', username, xp: 50 },
        { content: `Study DSA: ${currentDsaTopic.top} — ${currentDsaTopic.tip}`, category: 'dsa', username, xp: 30 },
        { content: `Aptitude: ${currentAptTopic.top} — ${currentAptTopic.tip}`, category: 'apt', username, xp: 20 }
      ];
      
      await Task.insertMany(defaultTasks);
      tasks = await Task.find({ 
        username,
        date: { $gte: startOfDay, $lte: endOfDay }
      });
    }

    res.json(tasks);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post((req, res) => {
  const { content, category, xp, difficulty, username, completed } = req.body;
  const newTask = new Task({ content, category, xp, difficulty, username, completed });

  newTask.save()
    .then(() => res.json('Task added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      task.completed = req.body.completed;
      task.save()
        .then(() => res.json('Task updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').delete(async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json('Task deleted!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;