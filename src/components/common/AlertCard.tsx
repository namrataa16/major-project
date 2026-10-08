import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, Info, Check, ArrowRight } from 'lucide-react';
import { SystemAlert } from '../../types';
import { cn, formatDateTime } from '../../utils/formatters';

interface AlertCardProps {
  alert: SystemAlert;
  onResolve?: (id: string) => void;
  compact?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onResolve, compact = false }) => {
  const getSeverityStyle = () => {
    switch (alert.severity) {
      case 'critical':
        return {
          container: 'bg-rose-50/70 border-rose-200 text-rose-950',
          icon: <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />,
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'warning':
        return {
          container: 'bg-amber-50/70 border-amber-200 text-amber-950',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />,
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      default:
        return {
          container: 'bg-blue-50/70 border-blue-200 text-blue-950',
          icon: <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />,
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
        };
    }
  };

  const style = getSeverityStyle();

  if (compact) {
    return (
      <div
        className={cn(
          'p-3 rounded-xl border flex items-start gap-3 transition-all',
          alert.resolved ? 'opacity-50 bg-slate-50 border-slate-200' : style.container
        )}
      >
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-tight truncate">{alert.title}</p>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{alert.description}</p>
        </div>
        {alert.actionLink && !alert.resolved && (
          <Link
            to={alert.actionLink}
            className="text-xs font-semibold text-sage-800 hover:text-sage-950 flex items-center gap-1 flex-shrink-0"
          >
            <span>{alert.actionText || 'View'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all',
        alert.resolved ? 'opacity-50 bg-slate-50 border-slate-200' : style.container
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/80 border border-inherit mt-0.5">
          {style.icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-[10px] uppercase font-bold px-2 py-0.5 rounded border', style.badge)}>
              {alert.severity}
            </span>
            <span className="text-xs text-slate-500">{formatDateTime(alert.date)}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
          <p className="text-xs text-slate-600 max-w-2xl">{alert.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        {alert.actionLink && !alert.resolved && (
          <Link
            to={alert.actionLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span>{alert.actionText || 'Take Action'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
        {onResolve && !alert.resolved && (
          <button
            onClick={() => onResolve(alert.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 transition-colors"
            title="Mark as resolved"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Dismiss</span>
          </button>
        )}
      </div>
    </div>
  );
};
