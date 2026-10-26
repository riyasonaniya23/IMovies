const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Theater location/address is required'],
    },
    city: {
      type: String,
      required: true,
      default: 'Mumbai',
    },
    totalScreens: {
      type: Number,
      required: true,
      default: 4,
    },
    facilities: {
      type: [String],
      default: ['Dolby Atmos', '4K Laser Projection', 'Recliner Seats', 'Food Court'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theater', theaterSchema);
