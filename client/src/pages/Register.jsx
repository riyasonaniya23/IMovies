import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card-dark p-4 shadow">
            <h3 className="fw-bold mb-1 text-center">Create Account</h3>
            <p className="text-secondary small text-center mb-4">
              Join IMovies for instant cinema bookings
            </p>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-secondary">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Phone Number</label>
                <input
                  type="text"
                  required
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Password</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="form-label small text-secondary">Account Role</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">Customer (Book Tickets)</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>
              <button type="submit" className="btn btn-danger w-100 fw-semibold py-2">
                Register Account
              </button>
            </form>

            <p className="text-center text-secondary small mt-4 mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-danger text-decoration-none fw-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
