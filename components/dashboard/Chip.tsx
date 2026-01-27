import { ReactNode } from 'react';
import clsx from 'clsx';

type ChipVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  icon?: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<ChipVariant, string> = {
  neutral: clsx(
    'bg-slate-100 dark:bg-slate-800',
    'text-slate-600 dark:text-slate-300',
    'border-slate-200 dark:border-slate-700'
  ),
  primary: clsx(
    'bg-primary-100 dark:bg-primary-900/30',
    'text-primary-700 dark:text-primary-300',
    'border-primary-200 dark:border-primary-800'
  ),
  secondary: clsx(
    'bg-secondary-100 dark:bg-secondary-900/30',
    'text-secondary-700 dark:text-secondary-300',
    'border-secondary-200 dark:border-secondary-800'
  ),
  success: clsx(
    'bg-emerald-100 dark:bg-emerald-900/30',
    'text-emerald-700 dark:text-emerald-400',
    'border-emerald-200 dark:border-emerald-800'
  ),
  warning: clsx(
    'bg-amber-100 dark:bg-amber-900/30',
    'text-amber-700 dark:text-amber-400',
    'border-amber-200 dark:border-amber-800'
  ),
  error: clsx(
    'bg-red-100 dark:bg-red-900/30',
    'text-red-700 dark:text-red-400',
    'border-red-200 dark:border-red-800'
  ),
  info: clsx(
    'bg-sky-100 dark:bg-sky-900/30',
    'text-sky-700 dark:text-sky-400',
    'border-sky-200 dark:border-sky-800'
  ),
};

export function Chip({
  children,
  variant = 'neutral',
  icon,
  className,
  size = 'sm',
}: ChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        variantStyles[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
