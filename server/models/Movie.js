const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    genre: {
      type: [String],
      required: true,
      default: ['Action', 'Drama'],
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    duration: {
      type: Number, // in minutes
      required: true,
      default: 140,
    },
    releaseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10,
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: 'Christopher Nolan',
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
