import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, requireAdmin, userController.getAll);
router.get('/stats', authenticate, requireAdmin, userController.getStats);
router.patch('/:id/role', authenticate, requireAdmin, userController.changeRole);
router.delete('/:id', authenticate, requireAdmin, userController.delete);

export default router;
