import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Boxes, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, Label, Field } from '../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    setEmail(role === 'admin' ? 'admin@tif.com' : 'user@tif.com');
    setPassword(role === 'admin' ? 'admin123' : 'user123');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Hero */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.35),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(239,68,68,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <Boxes size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight">StockPro</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
              <Sparkles size={12} /> Plataforma de gestión empresarial
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight">
              Tu inventario, claro como
              <br />
              <span className="bg-gradient-to-r from-white via-brand-200 to-brand-300 bg-clip-text text-transparent">
                nunca antes.
              </span>
            </h1>
            <p className="mt-4 text-base text-white/70">
              Control total de stock, productos y equipo. Analíticas en tiempo real, búsqueda instantánea
              y una experiencia diseñada para que tomes decisiones más rápido.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, label: 'Analíticas en vivo' },
                { icon: ShieldCheck, label: 'Roles y permisos' },
                { icon: Sparkles, label: 'Comando ⌘K' },
              ].map((f) => (
                <div key={f.label} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                  <f.icon size={16} className="text-brand-200" />
                  <div className="mt-2 text-xs font-medium text-white/80">{f.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-xs text-white/50">
            © 2026 · StockPro · Trabajo Integrador Final
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-app-grid p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-md shadow-brand-600/30">
                <Boxes size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-ink-900 dark:text-ink-50">
                Stock<span className="gradient-text">Pro</span>
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
            Bienvenido de vuelta
          </h2>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
            Ingresá con tu cuenta para continuar
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-lg border border-danger-200 bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-300"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
                required
              />
            </Field>
            <Field>
              <div className="mb-1.5 flex items-center justify-between">
                <Label htmlFor="password" className="mb-0">Contraseña</Label>
                <span className="text-[11px] font-medium text-ink-400 dark:text-ink-500">¿La olvidaste?</span>
              </div>
              <Input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={15} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="pointer-events-auto transition hover:text-ink-700 dark:hover:text-ink-200"
                  >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                required
              />
            </Field>

            <Button type="submit" className="w-full" loading={loading} rightIcon={!loading && <ArrowRight size={15} />}>
              Iniciar sesión
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            <span>Credenciales de demo</span>
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-left transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Admin</div>
              <div className="mt-0.5 text-xs font-medium text-ink-900 dark:text-ink-50">admin@tif.com</div>
              <div className="text-[11px] font-mono text-ink-400 dark:text-ink-500">admin123</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('user')}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-left transition hover:border-ink-300 hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800/60"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">User</div>
              <div className="mt-0.5 text-xs font-medium text-ink-900 dark:text-ink-50">user@tif.com</div>
              <div className="text-[11px] font-mono text-ink-400 dark:text-ink-500">user123</div>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
            ¿Aún no tenés cuenta?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Crear cuenta
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
