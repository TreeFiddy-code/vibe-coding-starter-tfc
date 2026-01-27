import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'sm',
  className,
  variant = 'primary',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div
        className={clsx(
          'flex-1 rounded-full overflow-hidden',
          'bg-slate-200 dark:bg-slate-700',
          size === 'sm' ? 'h-1.5' : 'h-2'
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300',
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums min-w-[2.5rem] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
