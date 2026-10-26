const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      default: ['manage_movies', 'manage_theaters', 'manage_shows', 'manage_bookings', 'moderate_reviews'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
