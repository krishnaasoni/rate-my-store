import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, User, Mail, MapPin, Lock, AlertCircle } from 'lucide-react';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form Validations
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
      await signup({ name, email, address, password });
      navigate('/stores', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary border border-primary/20 flex items-center justify-center shadow-sm">
            <Store className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="mt-4 text-center text-3xl font-extrabold text-app-text tracking-tight">
          RateMyStore
        </h1>
        <p className="mt-2 text-center text-sm text-app-muted">
          Create a Normal User account to explore & rate stores
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-app-card py-8 px-6 shadow-sm border border-app-border rounded-xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Full Name (Min 20, Max 60 chars)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Normal User Johnathan Doe Account"
                />
              </div>
              <div className="flex justify-between text-[11px] text-app-muted mt-1">
                <span>Must be between 20 and 60 characters</span>
                <span className={name.length >= 20 && name.length <= 60 ? 'text-primary font-semibold' : ''}>
                  {name.length}/60
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
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
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Password (8-16 chars, 1 uppercase, 1 special char)
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

            <div>
              <label className="block text-xs font-semibold text-app-text mb-1">
                Address (Max 400 chars)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-app-muted">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-app-border rounded-lg text-sm text-app-text placeholder-app-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                  placeholder="123 Pine Street, Apartment 4B, Springfield"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-app-muted">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
