import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/profile', { name, phone, password });
      localStorage.setItem('imovies_user', JSON.stringify(data));
      setUser(data);
      setPassword('');
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card-dark p-4">
            <h4 className="fw-bold mb-3">Account Profile</h4>
            {msg && <div className="alert alert-success py-2 small">{msg}</div>}
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label small text-secondary">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-dark text-secondary border-secondary"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Phone Number</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  className="form-control bg-dark text-light border-secondary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-danger w-100 fw-semibold">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
