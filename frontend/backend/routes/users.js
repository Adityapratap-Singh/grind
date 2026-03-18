const router = require('express').Router();
let User = require('../models/user.model');
let Task = require('../models/task.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
  const username = req.body.username;
  const weight = Number(req.body.weight);

  console.log(`Attempting to add user: ${username}, weight: ${weight}`);

  const newUser = new User({
    username,
    weight,
  });

  try {
    await newUser.save();
    console.log(`User ${username} saved successfully.`);
    res.json('User added!');
  } catch (err) {
    console.error(`Error adding user ${username}:`, err);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/update/:username').post(async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json('User not found');

    user.weight = Number(req.body.weight) || user.weight;
    user.targetWeight = Number(req.body.targetWeight) || user.targetWeight;
    user.startDate = req.body.startDate ? new Date(req.body.startDate) : user.startDate;

    await user.save();
    res.json('User updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
