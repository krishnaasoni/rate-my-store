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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <ShieldCheck className="w-3 h-3 mr-1" /> System Admin
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <StoreIcon className="w-3 h-3 mr-1" /> Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <User className="w-3 h-3 mr-1" /> Normal User
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                  RateMyStore
                </span>
              </div>
            </div>

            {/* Right profile controls */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-100">{user.name}</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <span className="text-xs text-slate-400">{user.email}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
                    title="Update Password"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Update Password</span>
                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/30"
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
