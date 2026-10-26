# IMovies - Movie Ticket Booking Made Simple (MERN Stack)

**IMovies** is a full-stack movie ticket booking platform built with **MongoDB, Express.js, React.js (Vite), and Node.js (MERN)** following the **Model-View-Controller (MVC)** architectural pattern. It enables users to browse movies, filter by genre/language, view showtimes across theaters, select seats in real time, make secure bookings, maintain watchlists, and submit movie reviews. It also provides a complete **Admin Dashboard** to manage movies, theaters, show schedules, bookings, and platform analytics.

---

## Project Architecture & Folder Structure

```text
IMovies/
├── client/                     # React + Vite Frontend (Port 5173)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       │   └── axios.js        # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── Header.jsx      # Role-based responsive Navigation Bar
│       │   ├── Footer.jsx      # Footer component
│       │   ├── MovieCard.jsx   # Movie card with rating & quick actions
│       │   └── SeatSelector.jsx# Interactive real-time cinema seat grid
│       ├── context/
│       │   └── AuthContext.jsx # Global authentication & watchlist state
│       ├── pages/
│       │   ├── Home.jsx        # Hero banner, featured movies, filters
│       │   ├── MovieDetails.jsx# Cast, trailer/info, showtimes, user reviews
│       │   ├── BookShow.jsx    # Seat selection & payment checkout flow
│       │   ├── MyBookings.jsx  # Booking history, ticket QR/ID, cancellation
│       │   ├── Watchlist.jsx   # Saved favorite movies
│       │   ├── Profile.jsx     # User profile & account preferences
│       │   ├── Login.jsx       # User & Admin login form
│       │   ├── Register.jsx    # Account registration form
│       │   └── AdminDashboard.jsx # Admin panel (Movies, Theaters, Shows, Bookings)
│       ├── App.jsx             # React Router configuration & protected routes
│       ├── App.css             # Custom cinema theme styles
│       └── main.jsx            # React DOM entry point
└── server/                     # Node.js + Express Backend (Port 8000)
    ├── config/
    │   └── db.js               # Mongoose connection to mongodb://127.0.0.1:27017/Imovies
    ├── controllers/
    │   ├── authController.js   # Registration, Login, Profile, Watchlist toggle
    │   ├── movieController.js  # Movie CRUD & Review submission
    │   ├── theaterController.js# Theater CRUD
    │   ├── showController.js   # Show schedule CRUD & seat availability
    │   └── bookingController.js# Seat locking/booking, payment record, cancellation, admin stats
    ├── middleware/
    │   ├── authMiddleware.js   # JWT verification & Admin role guard
    │   └── errorMiddleware.js  # Centralized error handling middleware
    ├── models/
    │   ├── User.js             # User schema (name, email, phone, password, role, watchlist)
    │   ├── Admin.js            # Admin schema (admin credentials & permissions)
    │   ├── Movie.js            # Movie schema (title, genre, language, duration, cast, rating, posterUrl)
    │   ├── Theater.js          # Theater schema (name, location, city, totalScreens, facilities)
    │   ├── Show.js             # Show schema (movie, theater, screenNumber, showDate, showTime, ticketPrice, bookedSeats)
    │   ├── Booking.js          # Booking schema (user, show, seats, totalAmount, paymentMethod, paymentId, bookingStatus)
    │   └── Review.js           # Review schema (user, movie, rating, comment)
    ├── routes/
    │   ├── authRoutes.js       # /api/auth/*
    │   ├── movieRoutes.js      # /api/movies/*
    │   ├── theaterRoutes.js    # /api/theaters/*
    │   ├── showRoutes.js       # /api/shows/*
    │   └── bookingRoutes.js    # /api/bookings/*
    ├── seed/
    │   └── seedData.js         # Auto-seeds sample movies, theaters, shows, and demo accounts
    ├── .env                    # Environment variables (PORT=8000, MONGO_URI, JWT_SECRET)
    ├── index.js                # Main Express server entry point (run via nodemon index.js)
    ├── server.js               # Alias entry point (requires index.js)
    └── package.json
```

---

## Steps for Project Execution

### Prerequisites
- **Node.js** (v16 or above) & **npm** (v8 or above)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017/Imovies` (or a MongoDB Atlas URI in `server/.env`)

### Step 1: Set Up the Backend (`server`)
1. Open a terminal and navigate into the `server` folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Verify the `.env` file inside `server/`:
   ```env
   PORT=8000
   MONGO_URI=mongodb://127.0.0.1:27017/Imovies
   JWT_SECRET=imovies_super_secret_jwt_key_2026
   ```
4. Start the backend server:
   ```bash
   npm start
   # or with nodemon:
   npx nodemon index.js
   ```
   The backend server will connect to MongoDB, automatically seed initial Movies, Theaters, Shows, and Demo Users if the database is empty, and listen on **`http://localhost:8000`**.

### Step 2: Set Up the Frontend (`client`)
1. Open a new terminal window and navigate into the `client` folder:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser.

---

## Pre-Configured Demo Accounts (Auto-Seeded)
- **Admin Account**:
  - **Email**: `admin@imovies.com`
  - **Password**: `admin123`
- **Customer Account**:
  - **Email**: `sarah@imovies.com`
  - **Password**: `user123`
