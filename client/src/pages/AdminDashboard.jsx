import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { FaFilm, FaBuilding, FaCalendarPlus, FaTicketAlt, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);

  // Movie Form
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 150,
    rating: 8.5,
    director: '',
    cast: '',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  });

  // Theater Form
  const [theaterForm, setTheaterForm] = useState({
    name: '',
    location: '',
    city: 'Mumbai',
    totalScreens: 4,
    facilities: 'Dolby Atmos, 4K Laser, Recliners',
  });

  // Show Form
  const [showForm, setShowForm] = useState({
    movie: '',
    theater: '',
    screenNumber: 1,
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:00 PM',
    ticketPrice: 250,
    vipPrice: 420,
  });

  const loadAllAdminData = async () => {
    try {
      const [bookingsRes, moviesRes, theatersRes, showsRes] = await Promise.all([
        API.get('/bookings/admin/all'),
        API.get('/movies'),
        API.get('/theaters'),
        API.get('/shows'),
      ]);
      setStats(bookingsRes.data.stats || {});
      setBookings(bookingsRes.data.bookings || []);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
      setShows(showsRes.data);

      if (moviesRes.data.length > 0 && !showForm.movie) {
        setShowForm((prev) => ({ ...prev, movie: moviesRes.data[0]._id }));
      }
      if (theatersRes.data.length > 0 && !showForm.theater) {
        setShowForm((prev) => ({ ...prev, theater: theatersRes.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    await API.post('/movies', movieForm);
    setMovieForm({
      ...movieForm,
      title: '',
      description: '',
      director: '',
      cast: '',
    });
    loadAllAdminData();
  };

  const handleDeleteMovie = async (id) => {
    await API.delete(`/movies/${id}`);
    loadAllAdminData();
  };

  const handleAddTheater = async (e) => {
    e.preventDefault();
    await API.post('/theaters', theaterForm);
    setTheaterForm({ ...theaterForm, name: '', location: '' });
    loadAllAdminData();
  };

  const handleDeleteTheater = async (id) => {
    await API.delete(`/theaters/${id}`);
    loadAllAdminData();
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    await API.post('/shows', showForm);
    loadAllAdminData();
  };

  const handleDeleteShow = async (id) => {
    await API.delete(`/shows/${id}`);
    loadAllAdminData();
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h3 className="fw-bold mb-0">IMovies Admin Management Portal</h3>
        <div className="btn-group">
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
          >
            Bookings & Revenue
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`btn btn-sm ${activeTab === 'movies' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
          >
            Manage Movies
          </button>
          <button
            onClick={() => setActiveTab('theaters')}
            className={`btn btn-sm ${activeTab === 'theaters' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
          >
            Manage Theaters
          </button>
          <button
            onClick={() => setActiveTab('shows')}
            className={`btn btn-sm ${activeTab === 'shows' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
          >
            Manage Showtimes
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card-dark p-3 text-center">
            <div className="text-secondary small">Total Revenue</div>
            <div className="fs-3 fw-bold text-success">₹{stats.totalRevenue || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-dark p-3 text-center">
            <div className="text-secondary small">Tickets Sold</div>
            <div className="fs-3 fw-bold text-warning">{stats.totalTicketsSold || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-dark p-3 text-center">
            <div className="text-secondary small">Active Movies</div>
            <div className="fs-3 fw-bold text-info">{stats.movieCount || movies.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-dark p-3 text-center">
            <div className="text-secondary small">Theaters & Shows</div>
            <div className="fs-3 fw-bold text-light">
              {stats.theaterCount || theaters.length} / {stats.showCount || shows.length}
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & BOOKINGS */}
      {activeTab === 'overview' && (
        <div className="card-dark p-4">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <FaTicketAlt className="text-danger" /> All Customer Reservations
          </h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle small mb-0">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Movie & Theater</th>
                  <th>Showtime</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-monospace">{b.paymentId}</td>
                    <td>
                      <div>{b.user?.name}</div>
                      <div className="text-secondary">{b.user?.email}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{b.show?.movie?.title}</div>
                      <div className="text-secondary">{b.show?.theater?.name}</div>
                    </td>
                    <td>
                      {b.show?.showDate} | {b.show?.showTime}
                    </td>
                    <td className="text-warning fw-bold">{b.seats.join(', ')}</td>
                    <td className="text-success fw-bold">₹{b.totalAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.bookingStatus === 'Confirmed' ? 'bg-success' : 'bg-secondary'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MOVIES */}
      {activeTab === 'movies' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card-dark p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaFilm className="text-danger" /> Add New Movie
              </h5>
              <form onSubmit={handleAddMovie}>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Movie Title</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Description</label>
                  <textarea
                    rows="2"
                    required
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={movieForm.description}
                    onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary">Genres (comma-sep)</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={movieForm.genre}
                      onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary">Language</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={movieForm.language}
                      onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    />
                  </div>
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary">Duration (mins)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={movieForm.duration}
                      onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={movieForm.rating}
                      onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Director</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Cast (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={movieForm.cast}
                    onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary">Poster Image URL</label>
                  <input
                    type="url"
                    required
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-danger btn-sm w-100 fw-semibold">
                  Publish Movie
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card-dark p-4">
              <h5 className="fw-bold mb-3">Catalog Movies ({movies.length})</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle small mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Language</th>
                      <th>Duration</th>
                      <th>Rating</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((m) => (
                      <tr key={m._id}>
                        <td className="fw-semibold">{m.title}</td>
                        <td>{m.language}</td>
                        <td>{m.duration} mins</td>
                        <td>★ {m.rating}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteMovie(m._id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE THEATERS */}
      {activeTab === 'theaters' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card-dark p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaBuilding className="text-danger" /> Add New Theater
              </h5>
              <form onSubmit={handleAddTheater}>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Theater Name</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={theaterForm.name}
                    onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Location / Address</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={theaterForm.location}
                    onChange={(e) => setTheaterForm({ ...theaterForm, location: e.target.value })}
                  />
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary">City</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={theaterForm.city}
                      onChange={(e) => setTheaterForm({ ...theaterForm, city: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary">Total Screens</label>
                    <input
                      type="number"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={theaterForm.totalScreens}
                      onChange={(e) =>
                        setTheaterForm({ ...theaterForm, totalScreens: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-secondary">Facilities (comma-sep)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={theaterForm.facilities}
                    onChange={(e) =>
                      setTheaterForm({ ...theaterForm, facilities: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-danger btn-sm w-100 fw-semibold">
                  Save Theater
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card-dark p-4">
              <h5 className="fw-bold mb-3">Registered Theaters ({theaters.length})</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle small mb-0">
                  <thead>
                    <tr>
                      <th>Theater</th>
                      <th>Location</th>
                      <th>Screens</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {theaters.map((t) => (
                      <tr key={t._id}>
                        <td className="fw-semibold">{t.name}</td>
                        <td>
                          {t.location}, {t.city}
                        </td>
                        <td>{t.totalScreens}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteTheater(t._id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE SHOWS */}
      {activeTab === 'shows' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card-dark p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaCalendarPlus className="text-danger" /> Schedule Showtime
              </h5>
              <form onSubmit={handleAddShow}>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Select Movie</label>
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    value={showForm.movie}
                    onChange={(e) => setShowForm({ ...showForm, movie: e.target.value })}
                  >
                    {movies.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small text-secondary">Select Theater</label>
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    value={showForm.theater}
                    onChange={(e) => setShowForm({ ...showForm, theater: e.target.value })}
                  >
                    {theaters.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary">Show Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={showForm.showDate}
                      onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary">Show Time</label>
                    <input
                      type="text"
                      placeholder="07:30 PM"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={showForm.showTime}
                      onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <label className="form-label small text-secondary">Screen #</label>
                    <input
                      type="number"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={showForm.screenNumber}
                      onChange={(e) => setShowForm({ ...showForm, screenNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label small text-secondary">Regular ₹</label>
                    <input
                      type="number"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={showForm.ticketPrice}
                      onChange={(e) => setShowForm({ ...showForm, ticketPrice: e.target.value })}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label small text-secondary">VIP ₹</label>
                    <input
                      type="number"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      value={showForm.vipPrice}
                      onChange={(e) => setShowForm({ ...showForm, vipPrice: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-danger btn-sm w-100 fw-semibold">
                  Create Show Schedule
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card-dark p-4">
              <h5 className="fw-bold mb-3">Scheduled Shows ({shows.length})</h5>
              <div className="table-responsive" style={{ maxHeight: '420px' }}>
                <table className="table table-dark table-hover align-middle small mb-0">
                  <thead>
                    <tr>
                      <th>Movie</th>
                      <th>Theater</th>
                      <th>Date & Time</th>
                      <th>Booked</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shows.map((s) => (
                      <tr key={s._id}>
                        <td className="fw-semibold">{s.movie?.title}</td>
                        <td>{s.theater?.name}</td>
                        <td>
                          {s.showDate} | {s.showTime}
                        </td>
                        <td>
                          {s.bookedSeats?.length || 0}/{s.totalSeats}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteShow(s._id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
