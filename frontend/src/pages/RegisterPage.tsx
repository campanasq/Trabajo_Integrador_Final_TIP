import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Boxes, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, Label, Field } from '../components/ui/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setError(''); setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'No pudimos crear tu cuenta');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-app-grid p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-md shadow-brand-600/30">
              <Boxes size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-ink-900 dark:text-ink-50">
              Stock<span className="gradient-text">Pro</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
            Crear tu cuenta
          </h2>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
            Empezá a gestionar tu inventario en segundos
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-danger-200 bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-300">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field>
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={15} />} placeholder="Juan García" required minLength={2} />
            </Field>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />} placeholder="tu@email.com" required />
            </Field>
            <Field>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={15} />} placeholder="Mínimo 6 caracteres" required minLength={6} />
              <div className="mt-2 flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={
                      'h-1 flex-1 rounded-full transition-colors ' +
                      (strength >= i
                        ? strength === 1
                          ? 'bg-danger-400'
                          : strength === 2
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                        : 'bg-ink-200 dark:bg-ink-800')
                    }
                  />
                ))}
              </div>
            </Field>

            <Button type="submit" className="w-full" loading={loading} rightIcon={!loading && <ArrowRight size={15} />}>
              Crear cuenta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Iniciar sesión
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(239,68,68,0.18),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.32),transparent_60%)]" />
        <div className="relative z-10 flex flex-1 items-center justify-center p-10">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              Una sola plataforma. <br /> Todo tu inventario.
            </h2>
            <p className="mt-3 text-white/70">
              Cargá productos, organizalos por categoría, llevá control de stock crítico y entendé qué
              pasa con tu negocio en un vistazo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
