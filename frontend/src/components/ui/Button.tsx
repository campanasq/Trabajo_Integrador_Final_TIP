import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  // gradient + inner sheen + premium shadow
  primary:
    'text-white bg-gradient-to-b from-brand-500 to-brand-700 ' +
    'shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_1px_2px_rgba(15,23,42,0.18),0_6px_18px_-6px_rgba(37,99,235,0.55)] ' +
    'hover:from-brand-500 hover:to-brand-600 hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_4px_rgba(15,23,42,0.2),0_10px_28px_-8px_rgba(37,99,235,0.65)] ' +
    'dark:from-brand-500 dark:to-brand-700',
  secondary:
    'bg-white text-ink-800 border border-ink-200 shadow-xs ' +
    'hover:bg-ink-50 hover:border-ink-300 hover:shadow-soft ' +
    'dark:bg-ink-900/80 dark:text-ink-100 dark:border-ink-700 dark:hover:bg-ink-800 dark:hover:border-ink-600',
  outline:
    'bg-transparent text-brand-700 border border-brand-200 ' +
    'hover:bg-brand-50 hover:border-brand-300 ' +
    'dark:text-brand-300 dark:border-brand-500/30 dark:hover:bg-brand-500/10 dark:hover:border-brand-500/50',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800/70',
  danger:
    'text-white bg-gradient-to-b from-danger-400 to-danger-600 ' +
    'shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_1px_2px_rgba(15,23,42,0.15),0_6px_18px_-6px_rgba(239,68,68,0.5)] ' +
    'hover:from-danger-400 hover:to-danger-600 hover:shadow-[0_2px_4px_rgba(15,23,42,0.18),0_10px_28px_-8px_rgba(239,68,68,0.6)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'group relative inline-flex select-none items-center justify-center rounded-lg font-semibold tracking-tight',
          'transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out-soft',
          'active:scale-[0.985] active:translate-y-[0.5px]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:active:translate-y-0',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-white dark:focus-visible:ring-offset-ink-950',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin" />
        ) : (
          leftIcon && (
            <span className="transition-transform duration-200 ease-out-soft group-hover:-translate-x-0.5">
              {leftIcon}
            </span>
          )
        )}
        {children}
        {!loading && rightIcon && (
          <span className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';
