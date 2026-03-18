const router = require('express').Router();
let Exam = require('../models/exam.model');

router.route('/:username').get((req, res) => {
  Exam.find({ username: req.params.username })
    .then(exams => res.json(exams))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
  const { username, subject, date } = req.body;
  
  try {
    // Check if exam for this subject already exists for the user
    let exam = await Exam.findOne({ username, subject });
    if (exam) {
      exam.date = new Date(date);
      await exam.save();
      res.json('Exam updated!');
    } else {
      const newExam = new Exam({ username, subject, date });
      await newExam.save();
      res.json('Exam added!');
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
