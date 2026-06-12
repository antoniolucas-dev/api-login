import { Router, Request, Response } from 'express';
import { usuariosDB, Role } from '../models/userModel';
import { requireAuth, requireRole } from '../midd/authMiddleware';

const router = Router();

// Aplica a dupla proteção de segurança (Guards)
router.use(requireAuth);
router.use(requireRole(Role.ADMIN));

// GET /admin - Lista todos os usuários cadastrados no sistema
router.get('/', (req: Request, res: Response) => {
  res.render('admin', { usuarios: usuariosDB });
});

export default router;