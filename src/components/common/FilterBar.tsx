import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/formatters';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  totalResults?: number;
  onReset?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterGroups = [],
  totalResults,
  onReset,
  extraActions,
  className,
}) => {
  const hasActiveFilters = searchQuery !== '' || filterGroups.some(f => f.value !== '' && f.value !== 'all');

  return (
    <div
      className={cn(
        'bg-white p-3 rounded-xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4',
        className
      )}
    >
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50/80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterGroups.map((group) => (
            <div key={group.id} className="flex-shrink-0">
              <select
                value={group.value}
                onChange={(e) => group.onChange(e.target.value)}
                className={cn(
                  'text-xs font-medium py-2 px-3 bg-slate-50/80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 cursor-pointer text-slate-700 hover:bg-white transition-all',
                  group.value && group.value !== 'all' && 'border-sage-300 bg-sage-50/60 text-sage-900 font-semibold'
                )}
              >
                <option value="all">All {group.label}s</option>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {hasActiveFilters && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Reset filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Right side: total count & extra action buttons */}
      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        {totalResults !== undefined && (
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalResults}</strong> results
          </span>
        )}
        {extraActions && <div className="flex items-center gap-2">{extraActions}</div>}
      </div>
    </div>
  );
};
