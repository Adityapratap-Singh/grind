const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
  username: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
