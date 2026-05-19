import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../lib/cn';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (t: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: number) => setToasts((ts) => ts.filter((t) => t.id !== id));

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = nextId++;
    setToasts((ts) => [...ts, { ...t, id }]);
    setTimeout(() => remove(id), 4200);
  }, []);

  const helper = (type: ToastType) => (title: string, description?: string) =>
    toast({ type, title, description });

  return (
    <ToastContext.Provider
      value={{
        toast,
        success: helper('success'),
        error: helper('error'),
        info: helper('info'),
        warning: helper('warning'),
      }}
    >
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={cn(
                'pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border bg-white/95 p-3.5 pr-4 shadow-pop backdrop-blur-xl dark:bg-ink-900/95',
                'border-ink-200/80 dark:border-ink-800',
                'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px]',
                t.type === 'success' && 'before:bg-gradient-to-b before:from-emerald-400 before:to-emerald-600',
                t.type === 'error' && 'before:bg-gradient-to-b before:from-danger-400 before:to-danger-600',
                t.type === 'warning' && 'before:bg-gradient-to-b before:from-amber-400 before:to-amber-600',
                t.type === 'info' && 'before:bg-gradient-to-b before:from-brand-400 before:to-brand-600',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset',
                  t.type === 'success' && 'bg-emerald-50 text-emerald-600 ring-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/25',
                  t.type === 'error' && 'bg-danger-50 text-danger-600 ring-danger-200/60 dark:bg-danger-500/15 dark:text-danger-300 dark:ring-danger-500/25',
                  t.type === 'warning' && 'bg-amber-50 text-amber-600 ring-amber-200/60 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25',
                  t.type === 'info' && 'bg-brand-50 text-brand-600 ring-brand-200/60 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/25',
                )}
              >
                {t.type === 'success' && <CheckCircle2 size={16} />}
                {t.type === 'error' && <XCircle size={16} />}
                {t.type === 'warning' && <AlertTriangle size={16} />}
                {t.type === 'info' && <Info size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">{t.title}</div>
                {t.description && (
                  <div className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{t.description}</div>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-ink-400 transition-colors duration-150 hover:text-ink-700 dark:hover:text-ink-200"
                aria-label="Cerrar"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
