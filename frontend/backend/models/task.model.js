const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  content: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  category: { type: String, required: true, enum: ['dsa', 'apt', 'habit', 'focus'] },
  xp: { type: Number, required: true, default: 10 },
  difficulty: { type: String, enum: ['easy', 'med', 'hard'] },
  date: { type: Date, required: true, default: Date.now },
  username: { type: String, required: true }
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;