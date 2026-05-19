import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, orders: { include: { items: true } } },
    });
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  },

  async changeRole(id: number, role: 'ADMIN' | 'USER') {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');
    return prisma.user.update({ where: { id }, data: { role }, select: { id: true, name: true, email: true, role: true } });
  },

  async delete(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');
    return prisma.user.delete({ where: { id } });
  },

  async getStats() {
    const [totalUsers, admins, regularUsers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);
    return { totalUsers, admins, regularUsers, recentUsers };
  },
};
