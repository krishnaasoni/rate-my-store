import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'STORE_OWNER') {
        navigate('/owner', { replace: true });
      } else {
        navigate('/stores', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary border border-primary/20 flex items-center justify-center shadow-sm">
            <Store className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="mt-4 text-center text-3xl font-extrabold text-app-text tracking-tight">
          RateMyStore
        </h1>
        <p className="mt-2 text-center text-sm text-app-muted">
          Sign in to your account (Admin, Store Owner, Normal User)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-app-card py-8 px-6 shadow-sm border border-app-border rounded-xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-app-text mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="admin@ratemystore.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </button>
          </form>

          {/* Seed demo quick fill helper */}
          <div className="mt-6 pt-6 border-t border-app-border">
            <p className="text-xs font-semibold text-app-muted mb-2">Quick Demo Seed Login:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@ratemystore.com');
                  setPassword('Password@123');
                }}
                className="px-2 py-1.5 bg-primary-soft text-primary-dark hover:bg-primary-soft/80 text-[11px] font-medium rounded-lg border border-primary/20 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('owner@ratemystore.com');
                  setPassword('Password@123');
                }}
                className="px-2 py-1.5 bg-primary-soft text-primary-dark hover:bg-primary-soft/80 text-[11px] font-medium rounded-lg border border-primary/20 transition-colors"
              >
                Store Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('johnathan.doe@example.com');
                  setPassword('Password@123');
                }}
                className="px-2 py-1.5 bg-primary-soft text-primary-dark hover:bg-primary-soft/80 text-[11px] font-medium rounded-lg border border-primary/20 transition-colors"
              >
                Normal User
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-app-muted">
              Don't have a user account?{' '}
              <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
