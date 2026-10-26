const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    screenNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    showDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    showTime: {
      type: String, // e.g., "06:30 PM"
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
      default: 250,
    },
    vipPrice: {
      type: Number,
      default: 400,
    },
    totalSeats: {
      type: Number,
      default: 64,
    },
    bookedSeats: {
      type: [String], // e.g., ["A1", "A2", "D5"]
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', showSchema);
