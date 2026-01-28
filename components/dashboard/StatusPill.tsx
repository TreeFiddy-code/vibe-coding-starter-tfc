import clsx from 'clsx';
import type { OperationStatus } from '@/app/dashboard/data';

interface StatusPillProps {
  status: OperationStatus;
}

const statusStyles: Record<OperationStatus, { bg: string; text: string; dot: string }> = {
  Running: {
    bg: 'bg-primary-100 dark:bg-primary-900/30',
    text: 'text-primary-700 dark:text-primary-300',
    dot: 'bg-primary-500',
  },
  Queued: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  Processing: {
    bg: 'bg-secondary-100 dark:bg-secondary-900/30',
    text: 'text-secondary-700 dark:text-secondary-400',
    dot: 'bg-secondary-500',
  },
  Paid: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  Fulfilled: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  Shipped: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Delivered: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Exception: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const styles = statusStyles[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        styles.bg,
        styles.text
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', styles.dot)} />
      {status}
    </span>
  );
}
