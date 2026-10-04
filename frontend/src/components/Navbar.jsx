import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, Key, User, ShieldCheck, Store as StoreIcon } from 'lucide-react';
import UpdatePasswordModal from './UpdatePasswordModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white border border-white/20">
            <ShieldCheck className="w-3 h-3 mr-1" /> System Admin
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white border border-white/20">
            <StoreIcon className="w-3 h-3 mr-1" /> Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white border border-white/20">
            <User className="w-3 h-3 mr-1" /> Normal User
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-primary-dark text-white shadow-md border-b border-primary-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white text-primary-dark flex items-center justify-center shadow-sm font-bold">
                <Store className="w-5 h-5 text-primary-dark" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  RateMyStore
                </span>
              </div>
            </div>

            {/* Right profile controls */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <span className="text-xs text-primary-soft/80">{user.email}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
                    title="Update Password"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Update Password</span>
                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showPasswordModal && (
        <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default Navbar;
