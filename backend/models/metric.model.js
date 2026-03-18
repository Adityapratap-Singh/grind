const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const metricSchema = new Schema({
  weight: { type: Number },
  waist: { type: Number },
  sleep: { type: Number },
  date: { type: Date, required: true, default: Date.now },
  username: { type: String, required: true }
}, {
  timestamps: true,
});

const Metric = mongoose.model('Metric', metricSchema);

module.exports = Metric;