import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-app-grid flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-200 bg-white text-brand-600 shadow-soft dark:border-ink-800 dark:bg-ink-900 dark:text-brand-400">
          <Compass size={26} />
        </div>
        <div className="mt-6 select-none bg-gradient-to-br from-brand-600 via-brand-700 to-danger-500 bg-clip-text text-[112px] font-bold leading-none tracking-tighter text-transparent">
          404
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
          Esta página no existe
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-500 dark:text-ink-400">
          La URL que intentaste abrir no está disponible o fue movida.
          Volvé al dashboard para continuar.
        </p>
        <Link
          to="/dashboard"
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700"
        >
          <ArrowLeft size={14} /> Ir al Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
