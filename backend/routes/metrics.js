const router = require('express').Router();
let Metric = require('../models/metric.model');

router.route('/:username').get((req, res) => {
  Metric.find({ username: req.params.username })
    .sort({ date: -1 })
    .then(metrics => res.json(metrics))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { weight, waist, sleep, username } = req.body;
  const newMetric = new Metric({ weight, waist, sleep, username });

  newMetric.save()
    .then(() => res.json('Metric added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;