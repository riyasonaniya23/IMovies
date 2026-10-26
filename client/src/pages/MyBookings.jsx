import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { FaTicketAlt, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/bookings/mybookings');
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this ticket reservation?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking');
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <FaTicketAlt className="text-danger" /> My Ticket Bookings
      </h3>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card-dark p-5 text-center">
          <h5>You have not booked any movie tickets yet.</h5>
          <p className="text-secondary mb-0">Browse movies on the home page to book your seats!</p>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div key={b._id} className="col-md-6">
              <div className="card-dark p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{b.show?.movie?.title || 'Movie Ticket'}</h5>
                    <span
                      className={`badge ${
                        b.bookingStatus === 'Confirmed' ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {b.bookingStatus === 'Confirmed' ? (
                        <>
                          <FaCheckCircle className="me-1" /> Confirmed
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="me-1" /> Cancelled
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-secondary small mb-2">
                    {b.show?.theater?.name} — {b.show?.theater?.location}
                  </p>

                  <div className="p-3 rounded bg-dark border border-secondary border-opacity-25 small mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Show Date & Time:</span>
                      <span className="fw-semibold">
                        {b.show?.showDate} at {b.show?.showTime}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Screen:</span>
                      <span>Screen {b.show?.screenNumber}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Seats Reserved:</span>
                      <span className="text-warning fw-bold">{b.seats.join(', ')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Amount Paid:</span>
                      <span className="text-success fw-bold">₹{b.totalAmount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary">Payment ID:</span>
                      <span className="font-monospace">{b.paymentId} ({b.paymentMethod})</span>
                    </div>
                  </div>
                </div>

                {b.bookingStatus === 'Confirmed' && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="btn btn-outline-danger btn-sm w-100"
                  >
                    Cancel Reservation & Release Seats
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
