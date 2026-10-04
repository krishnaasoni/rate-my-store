import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, User, Store, Star, Mail, MapPin, Calendar, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400">Loading user profile...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        ) : userData ? (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{userData.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 mt-1">
                  {userData.role}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300 divide-y divide-slate-800">
              <div className="pt-2 flex items-center space-x-3">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-mono text-xs">{userData.email}</span>
              </div>

              <div className="pt-3 flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{userData.address}</span>
              </div>

              <div className="pt-3 flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs">
                  Joined on {new Date(userData.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* STORE OWNER RATING DISPLAY REQUIREMENT */}
              {userData.role === 'STORE_OWNER' && userData.storeDetails && (
                <div className="pt-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-300 flex items-center">
                        <Store className="w-4 h-4 mr-1.5" /> Store: {userData.storeDetails.name}
                      </span>
                      <div className="flex items-center space-x-1 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-200">
                          {userData.storeDetails.averageRating} / 5.0
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Total Submitted Ratings Received: {userData.storeDetails.totalRatingsCount}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
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
