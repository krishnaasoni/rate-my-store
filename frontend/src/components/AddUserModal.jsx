import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, AlertCircle } from 'lucide-react';

const AddUserModal = ({ onClose, onSuccess }) => {
  const { API_URL } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (name.length < 20 || name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return;
    }

    if (address.length > 400) {
      setError('Address cannot exceed 400 characters');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be 8-16 characters and contain at least one uppercase letter and one special character'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/users`, {
        name,
        email,
        password,
        address,
        role,
      });

      if (response.data.success) {
        onSuccess && onSuccess(response.data.message);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-text/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl bg-app-card border border-app-border p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-app-muted hover:text-app-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary-dark flex items-center justify-center border border-primary/20">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-app-text">Add New User</h2>
            <p className="text-xs text-app-muted">Create Normal, Admin, or Store Owner account</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">
              Full Name (Min 20, Max 60 chars)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. System Administrator Account Name"
            />
            <span className="text-[11px] text-app-muted mt-1 block">
              Length: {name.length} / 60 characters
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="user@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Password (8-16 chars)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="USER">Normal User</option>
                <option value="ADMIN">System Administrator</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">
              Address (Max 400 chars)
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Full address details..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-app-muted hover:text-app-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
