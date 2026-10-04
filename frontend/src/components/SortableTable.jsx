import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const SortableTable = ({ columns, data, sortBy, sortOrder, onSort, emptyMessage = 'No records found' }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-app-border bg-app-card shadow-sm">
      <table className="w-full text-left text-sm text-app-text">
        <thead className="bg-primary-soft text-primary-dark text-xs uppercase tracking-wider border-b border-primary/20 sticky top-0">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3.5 font-bold ${
                  col.sortable ? 'cursor-pointer select-none hover:text-primary transition-colors' : ''
                }`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center space-x-1.5">
                  <span>{col.label}</span>
                  {col.sortable && (
                    <span className="text-primary-dark/60">
                      {sortBy === col.key ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-primary-dark" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-primary-dark" />
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
        <tbody className="divide-y divide-app-border">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-primary-soft/30 transition-colors"
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
              <td colSpan={columns.length} className="px-6 py-12 text-center text-app-muted">
                <div className="flex flex-col items-center justify-center space-y-1">
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
