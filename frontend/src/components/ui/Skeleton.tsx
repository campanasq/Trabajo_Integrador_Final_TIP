import { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton h-4 w-full', className)} {...props} />;
}

export function StatSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card dark:border-ink-800/80 dark:bg-ink-900/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(37,99,235,0.06),transparent_55%)] dark:bg-[radial-gradient(120%_80%_at_100%_0%,rgba(79,140,255,0.10),transparent_55%)]" />
      <div className="relative flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="relative mt-5 h-8 w-32" />
      <Skeleton className="relative mt-3 h-3 w-40" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton className={cn('h-3.5', i === 0 ? 'w-40' : 'w-24')} />
        </td>
      ))}
    </tr>
  );
}
