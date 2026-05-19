import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      res.status(400).json({ success: false, message: 'Datos inválidos', errors });
      return;
    }
    next(err);
  }
};
