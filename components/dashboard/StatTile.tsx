import { ReactNode } from 'react';
import clsx from 'clsx';

interface StatTileProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: 'text-slate-900 dark:text-gray-100',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
};

export function StatTile({
  label,
  value,
  subLabel,
  icon,
  variant = 'default',
  className,
}: StatTileProps) {
  return (
    <div
      className={clsx(
        'rounded-xl p-4',
        'bg-slate-50 dark:bg-slate-800/50',
        'border border-slate-100 dark:border-gray-700/50',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <span className="text-slate-500 dark:text-slate-400">{icon}</span>
        )}
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className={clsx('text-xl font-bold', variantStyles[variant])}>
        {value}
      </div>
      {subLabel && (
        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          {subLabel}
        </div>
      )}
    </div>
  );
}
