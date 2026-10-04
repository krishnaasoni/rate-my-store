import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, Store, AlertCircle } from 'lucide-react';

const AddStoreModal = ({ onClose, onSuccess }) => {
  const { API_URL } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreOwners = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/users`);
        if (res.data.success) {
          setOwners(res.data.users);
          if (res.data.users.length > 0) {
            setOwnerId(res.data.users[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Failed to fetch owners list:', err);
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchStoreOwners();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!ownerId) {
      setError('Please select or assign a Store Owner');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/stores`, {
        name,
        email,
        address,
        ownerId: parseInt(ownerId, 10),
      });

      if (response.data.success) {
        onSuccess && onSuccess(response.data.message);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create store');
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
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-app-text">Add New Store</h2>
            <p className="text-xs text-app-muted">Register store and assign Store Owner</p>
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
            <label className="block text-xs font-semibold text-app-text mb-1">Store Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Supertech Electronics Store"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">Store Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="contact@store.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">
              Assign Store Owner
            </label>
            {loadingOwners ? (
              <p className="text-xs text-app-muted py-2">Loading user accounts...</p>
            ) : (
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.email}) - Role: {o.role}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text mb-1">Store Address</label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Full physical store address..."
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
              {loading ? 'Creating Store...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
