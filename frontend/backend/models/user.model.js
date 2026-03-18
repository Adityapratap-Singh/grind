const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  weight: {
    type: Number,
    required: true
  },
  targetWeight: {
    type: Number,
    default: 68
  },
  startDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
