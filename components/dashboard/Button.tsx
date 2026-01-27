import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    'bg-primary-500 hover:bg-primary-600',
    'text-white',
    'shadow-sm',
    'focus:ring-2 focus:ring-primary-500/30'
  ),
  secondary: clsx(
    'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700',
    'text-slate-700 dark:text-slate-200',
    'border border-slate-200 dark:border-slate-700'
  ),
  ghost: clsx(
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800',
    'text-slate-600 dark:text-slate-400'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
};

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-medium transition-colors',
        'focus:outline-none focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
