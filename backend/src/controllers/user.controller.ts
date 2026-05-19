import { Response } from 'express';
import { userService } from '../services/user.service';
import { AuthRequest } from '../types';

export const userController = {
  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userService.getAll();
      res.json({ success: true, data: users });
    } catch (err: unknown) {
      res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
  },

  async changeRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { role } = req.body;
      if (!['ADMIN', 'USER'].includes(role)) {
        res.status(400).json({ success: false, message: 'Rol inválido' });
        return;
      }
      const user = await userService.changeRole(Number(req.params.id), role);
      res.json({ success: true, data: user, message: 'Rol actualizado' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(400).json({ success: false, message });
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const targetId = Number(req.params.id);
      if (targetId === req.user!.userId) {
        res.status(400).json({ success: false, message: 'No puedes eliminarte a ti mismo' });
        return;
      }
      await userService.delete(targetId);
      res.json({ success: true, message: 'Usuario eliminado' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(400).json({ success: false, message });
    }
  },

  async getStats(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await userService.getStats();
      res.json({ success: true, data: stats });
    } catch (err: unknown) {
      res.status(500).json({ success: false, message: 'Error' });
    }
  },
};
