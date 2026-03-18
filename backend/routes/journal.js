const router = require('express').Router();
let Journal = require('../models/journal.model');

router.route('/:username').get((req, res) => {
  Journal.find({ username: req.params.username })
    .sort({ date: -1 })
    .then(entries => res.json(entries))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { username, text, mood } = req.body;
  const newJournal = new Journal({ username, text, mood });

  newJournal.save()
    .then(() => res.json('Journal entry added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').delete(async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json('Journal entry deleted!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
