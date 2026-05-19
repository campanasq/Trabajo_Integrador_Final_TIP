import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldOff, Trash2, Users as UsersIcon, UserCheck, UserCog } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usersApi } from '../api';
import { User } from '../types';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { StatSkeleton, TableRowSkeleton } from '../components/ui/Skeleton';
import { ConfirmDialog } from '../components/ui/Modal';
import { formatDate } from '../lib/format';

export default function UsersPage() {
  const { user: me } = useAuth();
  const { success, error: tError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ type: 'role' | 'delete'; user: User } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try { const r = await usersApi.getAll(); setUsers(r.data.data || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const doConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      if (confirm.type === 'role') {
        const newRole = confirm.user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        await usersApi.changeRole(confirm.user.id, newRole);
        success('Rol actualizado', `${confirm.user.name} ahora es ${newRole}`);
      } else {
        await usersApi.delete(confirm.user.id);
        success('Usuario eliminado');
      }
      setConfirm(null);
      await load();
    } catch (err) {
      tError('Operación fallida', (err as { response?: { data?: { message?: string } } })?.response?.data?.message);
    } finally {
      setBusy(false);
    }
  };

  const admins = users.filter((u) => u.role === 'ADMIN').length;
  const regulars = users.length - admins;

  return (
    <Layout
      title="Gestión de usuarios"
      description="Administrá las cuentas y permisos del sistema"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard label="Total usuarios" value={users.length} icon={<UsersIcon size={18} />} tone="brand" hint="Cuentas registradas" />
            <StatCard label="Administradores" value={admins} icon={<UserCog size={18} />} tone="danger" hint="Con acceso total" />
            <StatCard label="Usuarios regulares" value={regulars} icon={<UserCheck size={18} />} tone="success" hint="Acceso limitado" />
          </>
        )}
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50/60 dark:bg-ink-900/40">
              <tr className="border-b border-ink-100 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:border-ink-800 dark:text-ink-400">
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Registrado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : (
                users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-ink-100 transition hover:bg-ink-50/40 dark:border-ink-800/60 dark:hover:bg-ink-800/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" tone={u.role === 'ADMIN' ? 'danger' : 'brand'} />
                        <div>
                          <div className="flex items-center gap-2 font-semibold text-ink-900 dark:text-ink-50">
                            {u.name}
                            {u.id === me?.id && (
                              <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                                TÚ
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-ink-400 dark:text-ink-500">#{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-500 dark:text-ink-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone={u.role === 'ADMIN' ? 'admin' : 'brand'} dot>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-500 dark:text-ink-400">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {u.id !== me?.id ? (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={u.role === 'ADMIN' ? <ShieldOff size={12} /> : <ShieldCheck size={12} />}
                              onClick={() => setConfirm({ type: 'role', user: u })}
                            >
                              {u.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-danger-600 hover:bg-danger-50 dark:text-danger-300 dark:hover:bg-danger-500/10"
                              onClick={() => setConfirm({ type: 'delete', user: u })}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-ink-400">—</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={doConfirm}
        title={confirm?.type === 'delete' ? 'Eliminar usuario' : 'Cambiar rol'}
        description={
          confirm?.type === 'delete'
            ? `Vas a eliminar a ${confirm.user.name}. Esta acción no se puede deshacer.`
            : confirm
            ? `¿Cambiar el rol de ${confirm.user.name} a ${confirm.user.role === 'ADMIN' ? 'USER' : 'ADMIN'}?`
            : undefined
        }
        danger={confirm?.type === 'delete'}
        loading={busy}
        confirmLabel={confirm?.type === 'delete' ? 'Sí, eliminar' : 'Cambiar rol'}
      />
    </Layout>
  );
}
