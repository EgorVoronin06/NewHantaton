const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  settings: {
    bufferTime: { type: Number, default: 5 }, // minutes before arrival
    walkingSpeed: { type: Number, default: 5 }, // km/h
    notificationPreferences: {
      push: { type: Boolean, default: true },
      telegram: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
    },
  },
  favorites: [
    {
      routeId: String,
      stopId: String,
    },
  ],
  history: [
    {
      routeId: String,
      stopId: String,
      timestamp: Date,
    },
  ],
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
