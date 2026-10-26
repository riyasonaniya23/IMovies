import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import SeatSelector from '../components/SeatSelector';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaLock, FaCreditCard } from 'react-icons/fa';

const BookShow = () => {
  const { showId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    API.get(`/shows/${showId}`)
      .then((res) => setShow(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load show'));
  }, [showId, user]);

  const handleToggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  if (!show) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger"></div>
      </div>
    );
  }

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const isVip = seat.startsWith('G') || seat.startsWith('H');
      return total + (isVip ? show.vipPrice : show.ticketPrice);
    }, 0);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post('/bookings', {
        showId: show._id,
        seats: selectedSeats,
        totalAmount: calculateTotal(),
        paymentMethod,
      });
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
      const refreshed = await API.get(`/shows/${showId}`);
      setShow(refreshed.data);
      setSelectedSeats([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-dark p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-3">
              <div>
                <h4 className="fw-bold mb-1">{show.movie?.title}</h4>
                <p className="text-secondary small mb-0">
                  {show.theater?.name} ({show.theater?.location}) • Screen {show.screenNumber}
                </p>
              </div>
              <div className="text-end">
                <span className="badge bg-danger fs-6">{show.showTime}</span>
                <div className="small text-secondary mt-1">{show.showDate}</div>
              </div>
            </div>

            {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}

            <SeatSelector
              bookedSeats={show.bookedSeats || []}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
              ticketPrice={show.ticketPrice}
              vipPrice={show.vipPrice}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-dark p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaCreditCard className="text-danger" /> Booking Summary
            </h5>

            <div className="mb-3 small">
              <div className="d-flex justify-content-between py-1">
                <span className="text-secondary">Movie:</span>
                <span className="fw-semibold">{show.movie?.title}</span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span className="text-secondary">Theater:</span>
                <span>{show.theater?.name}</span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span className="text-secondary">Date & Time:</span>
                <span>
                  {show.showDate} | {show.showTime}
                </span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span className="text-secondary">Selected Seats:</span>
                <span className="text-warning fw-bold">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </span>
              </div>
            </div>

            <hr className="border-secondary" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fs-5 fw-semibold">Total Payable</span>
              <span className="fs-4 fw-bold text-success">₹{calculateTotal()}</span>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="mb-3">
                <label className="form-label small text-secondary">
                  Select Payment Gateway / Method
                </label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Credit/Debit Card">Credit / Debit Card</option>
                  <option value="Razorpay">Razorpay Wallet</option>
                  <option value="Stripe">Stripe International</option>
                  <option value="NetBanking">NetBanking</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || selectedSeats.length === 0}
                className="btn btn-danger btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                <FaLock />
                {submitting ? 'Processing Payment...' : `Pay ₹${calculateTotal()} & Confirm`}
              </button>
            </form>

            <p className="text-secondary small text-center mt-3 mb-0">
              <FaCheckCircle className="text-success me-1" /> Instant e-ticket generation & seat lock protection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShow;
