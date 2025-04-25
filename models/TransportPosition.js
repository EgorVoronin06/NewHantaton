const mongoose = require('mongoose');

const transportPositionSchema = new mongoose.Schema({
  routeId: { type: String, required: true },
  vehicleId: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  timestamp: { type: Date, default: Date.now },
  delaySeconds: { type: Number, default: 0 }, // delay in seconds
});

transportPositionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('TransportPosition', transportPositionSchema);
