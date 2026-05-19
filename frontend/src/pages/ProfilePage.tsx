import { Check, Hash, Mail, ShieldCheck, User as UserIcon, X } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { formatDateLong } from '../lib/format';

const permissions = {
  admin: [
    { label: 'Ver productos y categorías', allowed: true },
    { label: 'Crear, editar y eliminar productos', allowed: true },
    { label: 'Gestionar categorías', allowed: true },
    { label: 'Ver y gestionar usuarios', allowed: true },
    { label: 'Cambiar roles', allowed: true },
    { label: 'Acceso a estadísticas', allowed: true },
  ],
  user: [
    { label: 'Ver catálogo de productos', allowed: true },
    { label: 'Ver categorías disponibles', allowed: true },
    { label: 'Crear o modificar productos', allowed: false },
    { label: 'Gestionar usuarios', allowed: false },
  ],
};

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();
  const list = isAdmin ? permissions.admin : permissions.user;

  return (
    <Layout title="Mi perfil" description="Información de tu cuenta y permisos">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto inline-flex">
              <Avatar name={user?.name} size="lg" tone={isAdmin ? 'danger' : 'brand'} className="!h-20 !w-20 !text-2xl" />
            </div>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-ink-900 dark:text-ink-50">{user?.name}</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">{user?.email}</p>
            <div className="mt-3 inline-flex">
              <Badge tone={isAdmin ? 'admin' : 'brand'} dot>
                {isAdmin ? 'Administrador' : 'Usuario'}
              </Badge>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-ink-100 pt-5 text-center dark:border-ink-800">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">ID</div>
                <div className="mt-1 font-mono text-sm font-semibold text-ink-900 dark:text-ink-50">#{user?.id}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Rol</div>
                <div className="mt-1 text-sm font-semibold text-ink-900 dark:text-ink-50">{user?.role}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Estado</div>
                <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activo
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Datos de la cuenta</CardTitle>
              <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                Información personal asociada
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Row icon={<UserIcon size={14} />} label="Nombre" value={user?.name ?? '—'} />
            <Row icon={<Mail size={14} />} label="Email" value={user?.email ?? '—'} mono />
            <Row icon={<Hash size={14} />} label="ID de usuario" value={`#${user?.id}`} mono />
            <Row icon={<ShieldCheck size={14} />} label="Cuenta creada" value={user?.createdAt ? formatDateLong(user.createdAt) : '—'} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Permisos de tu rol</CardTitle>
              <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                Lo que podés y no podés hacer en el sistema
              </p>
            </div>
            <Badge tone={isAdmin ? 'admin' : 'brand'}>{isAdmin ? 'ADMIN' : 'USER'}</Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {list.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-3 rounded-xl border border-ink-100 px-3 py-2.5 dark:border-ink-800"
              >
                <span className={
                  'flex h-7 w-7 items-center justify-center rounded-lg ' +
                  (p.allowed
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500')
                }>
                  {p.allowed ? <Check size={14} /> : <X size={14} />}
                </span>
                <span className={
                  'text-sm ' +
                  (p.allowed ? 'text-ink-900 dark:text-ink-50' : 'text-ink-400 dark:text-ink-500 line-through')
                }>
                  {p.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function Row({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-ink-100 px-3.5 py-3 dark:border-ink-800">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {icon}
        {label}
      </div>
      <div className={'mt-1 text-sm text-ink-900 dark:text-ink-50 ' + (mono ? 'font-mono' : 'font-medium')}>
        {value}
      </div>
    </div>
  );
}
