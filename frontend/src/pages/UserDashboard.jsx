import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import StarRating from '../components/StarRating';
import { Store, MapPin, Star, CheckCircle, Sparkles } from 'lucide-react';

const UserDashboard = () => {
  const { API_URL } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [ratingLoadingId, setRatingLoadingId] = useState(null);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_URL}/stores`, {
        params: { search, sortBy, sortOrder },
      });
      if (res.data.success) {
        setStores(res.data.stores);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder]);

  const handleRatingSubmit = async (storeId, ratingValue, existingRatingId) => {
    setRatingLoadingId(storeId);
    try {
      let res;
      if (existingRatingId) {
        // Modify rating
        res = await axios.put(`${API_URL}/ratings/${existingRatingId}`, { rating: ratingValue });
      } else {
        // Submit new rating
        res = await axios.post(`${API_URL}/ratings`, { storeId, rating: ratingValue });
      }

      if (res.data.success) {
        setAlert(existingRatingId ? 'Rating modified successfully!' : 'Rating submitted successfully!');
        setTimeout(() => setAlert(null), 3000);
        fetchStores();
      }
    } catch (err) {
      console.error('Rating error:', err);
    } finally {
      setRatingLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-app-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-app-text flex items-center">
              <Store className="w-8 h-8 mr-3 text-primary" /> Explore Registered Stores
            </h1>
            <p className="text-sm text-app-muted mt-1">
              Browse stores, search by name/address, view ratings, and share your feedback
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-xs font-semibold text-app-muted">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="bg-app-card border border-app-border text-xs font-semibold text-primary-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-sm"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="overallRating-desc">Highest Overall Rating</option>
              <option value="userRating-desc">My Submitted Rating</option>
            </select>
          </div>
        </div>

        {alert && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2 shadow-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{alert}</span>
          </div>
        )}

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          showRoleFilter={false}
          placeholder="Search stores by Name or Address..."
          onClear={() => setSearch('')}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-app-muted text-sm font-medium">Loading registered stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-app-card border border-app-border shadow-sm">
            <Store className="w-12 h-12 text-app-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-app-text">No stores found</h3>
            <p className="text-xs text-app-muted mt-1">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((s) => (
              <div
                key={s.id}
                className="flex flex-col justify-between rounded-xl bg-app-card border border-app-border p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary-dark flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-app-text group-hover:text-primary transition-colors">
                          {s.name}
                        </h3>
                        <span className="text-[11px] text-app-muted">{s.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start space-x-2 text-xs text-app-muted">
                    <MapPin className="w-4 h-4 text-app-muted flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{s.address}</span>
                  </div>

                  {/* OVERALL RATING DISPLAY */}
                  <div className="mt-5 p-3 rounded-lg bg-primary-soft/40 border border-primary/10 flex items-center justify-between">
                    <span className="text-xs text-app-muted font-medium">Overall Rating</span>
                    <div className="flex items-center space-x-1.5">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-extrabold text-app-text">
                        {s.overallRating}
                      </span>
                      <span className="text-[11px] text-app-muted">
                        / 5 ({s.totalRatingsCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* USER'S SUBMITTED RATING & SUBMIT/MODIFY OPTION */}
                <div className="mt-6 pt-4 border-t border-app-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-app-text flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
                      {s.userRating ? 'Your Rating (Modify):' : 'Submit Rating:'}
                    </span>
                    {s.userRating && (
                      <span className="text-xs font-bold text-primary-dark bg-primary-soft px-2 py-0.5 rounded border border-primary/20">
                        Rated {s.userRating}★
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-app-bg p-3 rounded-lg border border-app-border">
                    <StarRating
                      value={s.userRating || 0}
                      readOnly={ratingLoadingId === s.id}
                      onRate={(newRating) => handleRatingSubmit(s.id, newRating, s.userRatingId)}
                      size="md"
                    />
                    {ratingLoadingId === s.id && (
                      <span className="text-[11px] text-primary font-medium animate-pulse">
                        Saving...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
