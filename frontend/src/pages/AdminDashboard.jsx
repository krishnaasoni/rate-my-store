import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SortableTable from '../components/SortableTable';
import FilterBar from '../components/FilterBar';
import AddUserModal from '../components/AddUserModal';
import AddStoreModal from '../components/AddStoreModal';
import UserDetailModal from '../components/UserDetailModal';
import {
  Users,
  Store,
  Star,
  UserPlus,
  PlusCircle,
  Eye,
  CheckCircle,
  Shield,
  Building,
} from 'lucide-react';

const AdminDashboard = () => {
  const { API_URL } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  // Users State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [userSortBy, setUserSortBy] = useState('createdAt');
  const [userSortOrder, setUserSortOrder] = useState('desc');

  // Stores State
  const [stores, setStores] = useState([]);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortBy, setStoreSortBy] = useState('createdAt');
  const [storeSortOrder, setStoreSortOrder] = useState('desc');

  // Loading & Alert state
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/dashboard`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        params: {
          search: userSearch,
          role: roleFilter,
          sortBy: userSortBy,
          sortOrder: userSortOrder,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stores`, {
        params: {
          search: storeSearch,
          sortBy: storeSortBy,
          sortOrder: storeSortOrder,
        },
      });
      if (res.data.success) {
        setStores(res.data.stores);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchUsers(), fetchStores()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userSearch, roleFilter, userSortBy, userSortOrder]);

  useEffect(() => {
    fetchStores();
  }, [storeSearch, storeSortBy, storeSortOrder]);

  const handleUserSort = (columnKey) => {
    if (userSortBy === columnKey) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortBy(columnKey);
      setUserSortOrder('asc');
    }
  };

  const handleStoreSort = (columnKey) => {
    if (storeSortBy === columnKey) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortBy(columnKey);
      setStoreSortOrder('asc');
    }
  };

  const showAlertMessage = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(null), 3000);
    fetchStats();
    fetchUsers();
    fetchStores();
  };

  // User table columns
  const userColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.role === 'ADMIN'
              ? 'bg-primary-soft text-primary-dark border border-primary/20'
              : item.role === 'STORE_OWNER'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (item) => (
        <button
          onClick={() => setSelectedUserId(item.id)}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary-soft/50 hover:bg-primary-soft rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>
      ),
    },
  ];

  // Store table columns
  const storeColumns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Overall Rating',
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-1.5">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-bold text-app-text text-xs">
            {item.averageRating} / 5.0
          </span>
          <span className="text-[11px] text-app-muted">({item.totalRatingsCount})</span>
        </div>
      ),
    },
    {
      key: 'owner',
      label: 'Store Owner',
      sortable: false,
      render: (item) => item.owner?.name || '-',
    },
  ];

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-app-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-app-text flex items-center">
              <Shield className="w-8 h-8 mr-3 text-primary" /> System Administrator Dashboard
            </h1>
            <p className="text-sm text-app-muted mt-1">
              Manage platform users, registered stores, and review global ratings
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>

            <button
              onClick={() => setShowAddStoreModal(true)}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Store</span>
            </button>
          </div>
        </div>

        {alert && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2 shadow-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{alert}</span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-app-card border border-app-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-3xl font-extrabold text-app-text mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary-dark flex items-center justify-center border border-primary/20">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-app-card border border-app-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Total Stores
                </p>
                <p className="text-3xl font-extrabold text-app-text mt-1">{stats.totalStores}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary-dark flex items-center justify-center border border-primary/20">
                <Building className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-app-card border border-app-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-app-muted uppercase tracking-wider">
                  Submitted Ratings
                </p>
                <p className="text-3xl font-extrabold text-app-text mt-1">{stats.totalRatings}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-accent flex items-center justify-center border border-amber-200">
                <Star className="w-6 h-6 fill-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 mb-6 border-b border-app-border pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-sm'
                : 'text-app-muted hover:text-app-text bg-app-card border border-app-border'
            }`}
          >
            Users Directory ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'stores'
                ? 'bg-primary text-white shadow-sm'
                : 'text-app-muted hover:text-app-text bg-app-card border border-app-border'
            }`}
          >
            Stores Directory ({stores.length})
          </button>
        </div>

        {/* User Listing Tab */}
        {activeTab === 'users' && (
          <div>
            <FilterBar
              search={userSearch}
              onSearchChange={setUserSearch}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              showRoleFilter={true}
              placeholder="Search users by Name, Email, Address..."
              onClear={() => {
                setUserSearch('');
                setRoleFilter('');
              }}
            />

            <SortableTable
              columns={userColumns}
              data={users}
              sortBy={userSortBy}
              sortOrder={userSortOrder}
              onSort={handleUserSort}
              emptyMessage="No users matching filter criteria"
            />
          </div>
        )}

        {/* Store Listing Tab */}
        {activeTab === 'stores' && (
          <div>
            <FilterBar
              search={storeSearch}
              onSearchChange={setStoreSearch}
              showRoleFilter={false}
              placeholder="Search stores by Store Name, Email, Address..."
              onClear={() => setStoreSearch('')}
            />

            <SortableTable
              columns={storeColumns}
              data={stores}
              sortBy={storeSortBy}
              sortOrder={storeSortOrder}
              onSort={handleStoreSort}
              emptyMessage="No stores matching search criteria"
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={(msg) => showAlertMessage(msg)}
        />
      )}

      {showAddStoreModal && (
        <AddStoreModal
          onClose={() => setShowAddStoreModal(false)}
          onSuccess={(msg) => showAlertMessage(msg)}
        />
      )}

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
