import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export function Card({ children, className, elevated = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border p-5 transition-colors',
        'bg-white dark:bg-gray-900',
        'border-slate-200 dark:border-gray-800',
        'shadow-sm dark:shadow-lg dark:shadow-black/20',
        elevated && 'dark:bg-slate-900',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, action, className }: CardHeaderProps) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
        {title}
      </h3>
      {action}
    </div>
  );
}

interface CardSubPanelProps {
  children: ReactNode;
  className?: string;
}

export function CardSubPanel({ children, className }: CardSubPanelProps) {
  return (
    <div
      className={clsx(
        'rounded-xl p-3 mt-3',
        'bg-slate-50 dark:bg-slate-800/50',
        'border border-slate-100 dark:border-gray-700/50',
        className
      )}
    >
      {children}
    </div>
  );
}
