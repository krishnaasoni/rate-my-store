import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const SortableTable = ({ columns, data, sortBy, sortOrder, onSort, emptyMessage = 'No records found' }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-4 font-semibold ${
                  col.sortable ? 'cursor-pointer select-none hover:text-sky-400 transition-colors' : ''
                }`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center space-x-1.5">
                  <span>{col.label}</span>
                  {col.sortable && (
                    <span className="text-slate-500">
                      {sortBy === col.key ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(item) : item[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
