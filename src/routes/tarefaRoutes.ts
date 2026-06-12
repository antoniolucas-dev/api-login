import { Router, Request, Response } from 'express';
import { tarefasDB } from '../models/tarefaModel';
import { requireAuth } from '../midd/authMiddleware';
import { Role } from '../models/userModel';

const router = Router();

// Protege todas as rotas de tarefas usando o middleware requireAuth
router.use(requireAuth);

router.get('/', (req: Request, res: Response) => {
  const sessao = req.session as any;
  
  let tarefasFiltradas;

  // REGRA: Se for ADMIN, vê TUDO. Se for USER, vê apenas as suas tarefas.
  if (sessao.userRole === Role.ADMIN) {
    tarefasFiltradas = tarefasDB;
  } else {
    tarefasFiltradas = tarefasDB.filter(t => t.userId === sessao.userId);
  }

  res.render('tarefas', { tarefas: tarefasFiltradas, userRole: sessao.userRole });
});

router.post('/nova', (req: Request, res: Response) => {
  const { titulo } = req.body;
  const sessao = req.session as any;

  if (!titulo || titulo.trim() === '') {
    req.flash('error_msg', 'Preencha o título da tarefa.');
    return res.redirect('/tarefas');
  }

  tarefasDB.push({
    id: Date.now().toString(),
    userId: sessao.userId,
    titulo: titulo.trim(),
    concluida: false
  });

  req.flash('success_msg', 'Tarefa adicionada!');
  res.redirect('/tarefas');
});

export default router;