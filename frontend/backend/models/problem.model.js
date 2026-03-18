const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const problemSchema = new Schema({
  name: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['easy', 'med', 'hard'] },
  xp: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  username: { type: String, required: true }
}, {
  timestamps: true,
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;