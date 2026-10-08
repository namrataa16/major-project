import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
    label?: string;
  };
  variant?: 'default' | 'sage' | 'amber' | 'blue' | 'rose' | 'emerald';
  className?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  onClick,
}) => {
  const getIconBg = () => {
    switch (variant) {
      case 'sage':
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'blue':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-card transition-all duration-200 flex flex-col justify-between',
        onClick && 'cursor-pointer hover:border-emerald-300 hover:shadow-card-hover group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-950 transition-colors">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={cn('p-2.5 rounded-xl border flex-shrink-0', getIconBg())}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-slate-100 text-xs flex-wrap">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded text-[11px]',
                trend.positive
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                  : 'text-rose-700 bg-rose-50 border border-rose-200/60'
              )}
            >
              {trend.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-slate-500 truncate text-[11px]">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
