import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, Store, Star, Mail, MapPin, Calendar } from 'lucide-react';

const UserDetailModal = ({ userId, onClose }) => {
  const { API_URL } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/users/${userId}`);
        if (res.data.success) {
          setUserData(res.data.user);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId, API_URL]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-text/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl bg-app-card border border-app-border p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-app-muted hover:text-app-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-app-muted font-medium">Loading user profile...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        ) : userData ? (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary-dark font-bold text-lg flex items-center justify-center border border-primary/20">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-app-text">{userData.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-soft text-primary-dark border border-primary/20 mt-1">
                  {userData.role}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-app-text divide-y divide-app-border">
              <div className="pt-2 flex items-center space-x-3">
                <Mail className="w-4 h-4 text-app-muted flex-shrink-0" />
                <span className="font-mono text-xs text-app-muted">{userData.email}</span>
              </div>

              <div className="pt-3 flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-app-muted flex-shrink-0 mt-0.5" />
                <span className="text-xs text-app-text leading-relaxed">{userData.address}</span>
              </div>

              <div className="pt-3 flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-app-muted flex-shrink-0" />
                <span className="text-xs text-app-muted">
                  Joined on {new Date(userData.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* STORE OWNER RATING DISPLAY REQUIREMENT */}
              {userData.role === 'STORE_OWNER' && userData.storeDetails && (
                <div className="pt-4">
                  <div className="p-4 rounded-lg bg-primary-soft/40 border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary-dark flex items-center">
                        <Store className="w-4 h-4 mr-1.5" /> Store: {userData.storeDetails.name}
                      </span>
                      <div className="flex items-center space-x-1 bg-white px-2.5 py-1 rounded-md border border-app-border">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-xs font-bold text-app-text">
                          {userData.storeDetails.averageRating} / 5.0
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-app-muted">
                      Total Submitted Ratings Received: {userData.storeDetails.totalRatingsCount}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-app-border flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-app-text bg-app-bg hover:bg-primary-soft rounded-lg transition-colors border border-app-border"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserDetailModal;
