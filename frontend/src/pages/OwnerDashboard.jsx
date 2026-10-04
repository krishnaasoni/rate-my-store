import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SortableTable from '../components/SortableTable';
import { Store, Star, Users, MapPin, Mail, Calendar, Award } from 'lucide-react';

const OwnerDashboard = () => {
  const { API_URL } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Table sorting state
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchOwnerDashboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/owner/dashboard`);
        if (res.data.success) {
          setDashboard(res.data.dashboard);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load owner dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDashboard();
  }, [API_URL]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  // Prepare table data with sorting
  const getSortedRaters = () => {
    if (!dashboard || !dashboard.ratingUsers) return [];
    const list = [...dashboard.ratingUsers];
    const order = sortOrder === 'asc' ? 1 : -1;

    list.sort((a, b) => {
      if (sortBy === 'rating') {
        return (a.rating - b.rating) * order;
      }
      if (sortBy === 'userName') {
        return a.user.name.localeCompare(b.user.name) * order;
      }
      if (sortBy === 'userEmail') {
        return a.user.email.localeCompare(b.user.email) * order;
      }
      // default: submittedAt
      return (new Date(a.submittedAt) - new Date(b.submittedAt)) * order;
    });

    return list;
  };

  const columns = [
    {
      key: 'userName',
      label: 'User Name',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-white">{item.user.name}</span>
      ),
    },
    {
      key: 'userEmail',
      label: 'User Email',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs text-slate-300">{item.user.email}</span>
      ),
    },
    {
      key: 'userAddress',
      label: 'User Address',
      sortable: false,
      render: (item) => (
        <span className="text-xs text-slate-300 leading-relaxed">{item.user.address}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Submitted Rating',
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= item.rating
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                  : 'text-slate-700 fill-slate-800'
              }`}
            />
          ))}
          <span className="ml-1.5 text-xs font-bold text-amber-300">({item.rating})</span>
        </div>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Submitted Date',
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-400">
          {new Date(item.submittedAt).toLocaleDateString()} {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center">
              <Store className="w-8 h-8 mr-3 text-emerald-400" /> Store Owner Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor store rating analytics and customer feedback
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm">Loading store analytics...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        ) : !dashboard ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Store Assigned</h3>
            <p className="text-xs text-slate-400 mt-1">
              Please contact the System Administrator to assign a store to your account.
            </p>
          </div>
        ) : (
          <div>
            {/* STORE PROFILE & AVERAGE RATING CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Store Details Card */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{dashboard.store.name}</h2>
                      <span className="text-xs text-slate-400 flex items-center mt-0.5">
                        <Mail className="w-3.5 h-3.5 mr-1" /> {dashboard.store.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{dashboard.store.address}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Store ID: #{dashboard.store.id}</span>
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <Award className="w-4 h-4 mr-1" /> Active Store
                  </span>
                </div>
              </div>

              {/* STORE AVERAGE RATING DISPLAY REQUIREMENT */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                      Overall Average Rating
                    </span>
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  </div>

                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-amber-300">
                      {dashboard.averageRating}
                    </span>
                    <span className="text-slate-400 text-sm font-semibold">/ 5.0</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Based on <strong className="text-white">{dashboard.totalRatingsCount}</strong> user submission{dashboard.totalRatingsCount === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(dashboard.averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700 fill-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* LIST OF USERS WHO RATED STORE REQUIREMENT */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-sky-400" /> Customer Submitted Ratings ({dashboard.ratingUsers.length})
                </h3>
              </div>

              <SortableTable
                columns={columns}
                data={getSortedRaters()}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                emptyMessage="No customer ratings submitted for this store yet"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;
