import { InputHTMLAttributes, forwardRef, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, invalid, ...props }, ref) => {
    return (
      <div className="group relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors duration-200 group-focus-within:text-brand-500 dark:text-ink-500">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'input-base',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            invalid && 'border-danger-400 focus:border-danger-500 focus:shadow-glow-danger',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors duration-200 group-focus-within:text-ink-600 dark:text-ink-500">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'input-base appearance-none pr-8 cursor-pointer',
        'bg-[url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2364748b%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27><polyline points=%276 9 12 15 18 9%27/></svg>")] bg-no-repeat',
        '[background-position:right_10px_center]',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('input-base min-h-[88px] py-2.5 resize-y', className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export function Label({ children, htmlFor, className }: { children: ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400',
        className,
      )}
    >
      {children}
    </label>
  );
}

export function Field({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col', className)}>{children}</div>;
}
