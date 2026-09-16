import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-navy-700 text-white hover:bg-navy-600 active:bg-navy-800',
  secondary: 'bg-white text-navy-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
  ghost: 'text-navy-600 hover:bg-gray-100 active:bg-gray-200',
  danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-700',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled, type = 'button', icon }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
