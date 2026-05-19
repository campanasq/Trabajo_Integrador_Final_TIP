import { Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types';

export const authController = {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result, message: 'Usuario registrado exitosamente' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar';
      res.status(400).json({ success: false, message });
    }
  },

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json({ success: true, data: result, message: 'Login exitoso' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      res.status(401).json({ success: false, message });
    }
  },

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.getProfile(userId);
      res.json({ success: true, data: user });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener perfil';
      res.status(404).json({ success: false, message });
    }
  },
};
