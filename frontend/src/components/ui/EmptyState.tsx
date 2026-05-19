import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center',
        'dark:border-ink-800 dark:bg-ink-900/40',
        className,
      )}
    >
      {/* ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(37,99,235,0.06),transparent_55%)] dark:bg-[radial-gradient(60%_50%_at_50%_30%,rgba(79,140,255,0.10),transparent_55%)]" />

      {icon && (
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-white text-brand-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-brand-100 dark:from-brand-500/15 dark:to-ink-900 dark:text-brand-300 dark:ring-brand-500/25">
          {icon}
        </div>
      )}
      <h3 className="relative font-display text-base font-semibold tracking-tight text-ink-900 dark:text-ink-50">
        {title}
      </h3>
      {description && (
        <p className="relative mt-1.5 max-w-sm text-sm text-ink-500 dark:text-ink-400">{description}</p>
      )}
      {action && <div className="relative mt-5">{action}</div>}
    </div>
  );
}
