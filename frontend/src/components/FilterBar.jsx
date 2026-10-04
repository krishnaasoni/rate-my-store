import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  showRoleFilter = false,
  placeholder = 'Search by Name, Email, Address...',
  onClear,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Role Filter Dropdown */}
      {showRoleFilter && (
        <div className="relative w-full sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All User Roles</option>
            <option value="ADMIN">System Administrator</option>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
      )}

      {/* Clear button */}
      {(search || roleFilter) && onClear && (
        <button
          onClick={onClear}
          className="px-3.5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};

export default FilterBar;
