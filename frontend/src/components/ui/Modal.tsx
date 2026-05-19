import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
            className={cn(
              'relative w-full overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-pop',
              'dark:border-ink-800 dark:bg-ink-900',
              // premium top accent line
              'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px',
              'before:bg-gradient-to-r before:from-transparent before:via-brand-400/60 before:to-transparent',
              'dark:before:via-brand-400/40',
              sizes[size],
            )}
          >
            {/* subtle radial bg */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_-20%,rgba(37,99,235,0.06),transparent_55%)] dark:bg-[radial-gradient(120%_60%_at_50%_-20%,rgba(79,140,255,0.10),transparent_55%)]" />

            <div className="relative flex items-start justify-between gap-4 px-5 pb-3 pt-5">
              <div className="min-w-0">
                {title && (
                  <h3 className="font-display text-[17px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-all duration-150 hover:bg-ink-100 hover:text-ink-700 active:scale-95 dark:hover:bg-ink-800 dark:hover:text-ink-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="relative px-5 pb-5">{children}</div>
            {footer && (
              <div className="relative flex items-center justify-end gap-2 border-t border-ink-100 bg-ink-50/40 px-5 py-3 dark:border-ink-800 dark:bg-ink-950/30">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger,
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      description={description}
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 items-center rounded-lg border border-ink-200 bg-white px-3.5 text-sm font-semibold text-ink-700 transition-all hover:bg-ink-50 hover:border-ink-300 active:scale-[0.98] disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50',
              danger
                ? 'bg-gradient-to-b from-danger-400 to-danger-600 shadow-[0_6px_18px_-6px_rgba(239,68,68,0.5)] hover:shadow-[0_10px_24px_-8px_rgba(239,68,68,0.6)]'
                : 'bg-gradient-to-b from-brand-500 to-brand-700 shadow-[0_6px_18px_-6px_rgba(37,99,235,0.5)] hover:shadow-[0_10px_24px_-8px_rgba(37,99,235,0.6)]',
            )}
          >
            {loading ? 'Procesando…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="h-1" />
    </Modal>
  );
}
