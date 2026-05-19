export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(n);

export const formatNumber = (n: number) =>
  new Intl.NumberFormat('es-AR').format(n);

export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatDateLong = (d: string | Date) =>
  new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });

export const initials = (name?: string) =>
  (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
