import React from 'react';
import { cn } from '../../utils/formatters';

export type BadgeVariant =
  | 'Available'
  | 'On Trip'
  | 'Maintenance'
  | 'Inactive'
  | 'Planned'
  | 'Loading'
  | 'On Route'
  | 'Delivered'
  | 'Delayed'
  | 'Draft'
  | 'Ready'
  | 'Assigned'
  | 'In Transit'
  | 'Valid'
  | 'Expiring Soon'
  | 'Expired'
  | 'Paid'
  | 'Pending'
  | 'Overdue'
  | 'Active'
  | 'Low'
  | 'Medium'
  | 'High'
  | string;

interface StatusBadgeProps {
  status: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'sm' }) => {
  const getStyle = (s: string) => {
    switch (s) {
      // Vehicle Status
      case 'Available':
      case 'Valid':
      case 'Delivered':
      case 'Paid':
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';

      case 'On Trip':
      case 'On Route':
      case 'In Transit':
        return 'bg-sage-100 text-sage-900 border-sage-300';

      case 'Loading':
      case 'Assigned':
        return 'bg-sky-50 text-sky-700 border-sky-200';

      case 'Planned':
      case 'Ready':
      case 'Draft':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';

      case 'Maintenance':
      case 'Expiring Soon':
      case 'Pending':
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';

      case 'Inactive':
      case 'Expired':
      case 'Overdue':
      case 'Delayed':
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDotStyle = (s: string) => {
    switch (s) {
      case 'Available':
      case 'Valid':
      case 'Delivered':
      case 'Paid':
      case 'Active':
      case 'Low':
        return 'bg-emerald-500';

      case 'On Trip':
      case 'On Route':
      case 'In Transit':
        return 'bg-sage-600';

      case 'Maintenance':
      case 'Expiring Soon':
      case 'Pending':
      case 'Medium':
        return 'bg-amber-500';

      case 'Inactive':
      case 'Expired':
      case 'Overdue':
      case 'Delayed':
      case 'High':
        return 'bg-rose-500';

      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        getStyle(status),
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', getDotStyle(status))} />
      {status}
    </span>
  );
};
