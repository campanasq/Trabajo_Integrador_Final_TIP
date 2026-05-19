import { Request } from 'express';

export interface AuthPayload {
  userId: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
