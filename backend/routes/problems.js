const router = require('express').Router();
let Problem = require('../models/problem.model');

router.route('/:username').get((req, res) => {
  Problem.find({ username: req.params.username })
    .then(problems => res.json(problems))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { name, difficulty, xp, username } = req.body;
  const newProblem = new Problem({ name, difficulty, xp, username });

  newProblem.save()
    .then(() => res.json('Problem added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').delete(async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json('Problem deleted!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;