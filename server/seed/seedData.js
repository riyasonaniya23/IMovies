const User = require('../models/User');
const Admin = require('../models/Admin');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const Review = require('../models/Review');

const seedInitialData = async () => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount > 0) {
      return;
    }

    console.log('Seeding initial IMovies database records...');

    // 1. Create Demo Admin & Demo User
    const adminUser = await User.create({
      name: 'Riya Admin',
      email: 'admin@imovies.com',
      phone: '9876500001',
      password: 'admin123',
      role: 'admin',
    });

    await Admin.create({
      userId: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
    });

    const regularUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@imovies.com',
      phone: '9876500002',
      password: 'user123',
      role: 'user',
    });

    // 2. Create Movies
    const movies = await Movie.insertMany([
      {
        title: 'Dune: Part Two',
        description:
          'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: 'English',
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        rating: 9.1,
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
        director: 'Denis Villeneuve',
        posterUrl:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
      },
      {
        title: 'Oppenheimer',
        description:
          'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        duration: 180,
        releaseDate: new Date('2023-07-21'),
        rating: 9.0,
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
        director: 'Christopher Nolan',
        posterUrl:
          'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      },
      {
        title: 'Kalki 2898 AD',
        description:
          'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces in a dystopian future.',
        genre: ['Sci-Fi', 'Action', 'Mythology'],
        language: 'Hindi',
        duration: 181,
        releaseDate: new Date('2024-06-27'),
        rating: 8.7,
        cast: ['Prabhas', 'Deepika Padukone', 'Amitabh Bachchan', 'Kamal Haasan'],
        director: 'Nag Ashwin',
        posterUrl:
          'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80',
      },
      {
        title: 'Spider-Man: Beyond the Spider-Verse',
        description:
          'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        releaseDate: new Date('2024-05-15'),
        rating: 9.3,
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
        director: 'Joaquim Dos Santos',
        posterUrl:
          'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=1400&q=80',
      },
      {
        title: 'Jawan',
        description:
          'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
        genre: ['Action', 'Thriller'],
        language: 'Hindi',
        duration: 169,
        releaseDate: new Date('2023-09-07'),
        rating: 8.4,
        cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi'],
        director: 'Atlee',
        posterUrl:
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
      },
      {
        title: 'Leo',
        description:
          'Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of murderous thugs and gains attention from a ruthless drug cartel.',
        genre: ['Action', 'Crime', 'Thriller'],
        language: 'Tamil',
        duration: 164,
        releaseDate: new Date('2023-10-19'),
        rating: 8.3,
        cast: ['Vijay', 'Trisha Krishnan', 'Sanjay Dutt'],
        director: 'Lokesh Kanagaraj',
        posterUrl:
          'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=80',
      },
    ]);

    // 3. Create Theaters
    const theaters = await Theater.insertMany([
      {
        name: 'PVR IMAX Phoenix Palladium',
        location: 'Lower Parel, Mumbai',
        city: 'Mumbai',
        totalScreens: 6,
        facilities: ['IMAX Laser', 'Dolby Atmos', 'Luxury Recliners', 'Gourmet Cafe'],
      },
      {
        name: 'INOX Megaplex Inorbit',
        location: 'Malad West, Mumbai',
        city: 'Mumbai',
        totalScreens: 5,
        facilities: ['4DX', 'Dolby 7.1', 'In-seat Dining'],
      },
      {
        name: 'Cinepolis Seasons Mall',
        location: 'Magarpatta, Pune',
        city: 'Pune',
        totalScreens: 4,
        facilities: ['4K Laser Projection', 'Dolby Atmos', 'VIP Lounge'],
      },
    ]);

    // 4. Create Shows for Today and Tomorrow
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const showRecords = [];
    movies.forEach((movie, idx) => {
      theaters.forEach((theater, tIdx) => {
        showRecords.push({
          movie: movie._id,
          theater: theater._id,
          screenNumber: (idx % theater.totalScreens) + 1,
          showDate: today,
          showTime: tIdx === 0 ? '02:30 PM' : tIdx === 1 ? '06:30 PM' : '09:45 PM',
          ticketPrice: 250,
          vipPrice: 420,
          totalSeats: 64,
          bookedSeats: ['C4', 'C5', 'D4', 'D5'],
        });
        showRecords.push({
          movie: movie._id,
          theater: theater._id,
          screenNumber: ((idx + 1) % theater.totalScreens) + 1,
          showDate: tomorrow,
          showTime: tIdx === 0 ? '05:00 PM' : '09:00 PM',
          ticketPrice: 280,
          vipPrice: 450,
          totalSeats: 64,
          bookedSeats: ['E3', 'E4'],
        });
      });
    });

    await Show.insertMany(showRecords);

    // 5. Seed Sample Reviews
    await Review.insertMany([
      {
        user: regularUser._id,
        userName: regularUser.name,
        movie: movies[0]._id,
        rating: 10,
        comment: 'Breathtaking visuals and sound design in IMAX! A must-watch cinema experience.',
      },
      {
        user: regularUser._id,
        userName: regularUser.name,
        movie: movies[1]._id,
        rating: 9,
        comment: 'Incredible performances and gripping pacing from start to finish.',
      },
    ]);

    console.log('IMovies sample data seeded successfully!');
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedInitialData;
