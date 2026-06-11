import { Router, Request, Response, NextFunction } from 'express';
import { tarefasDB, Tarefa } from '../models/tarefaModel';

const router = Router();

// Função que impede pessoas não logadas de ver as tarefas
export function garantirAutenticacao(req: Request, res: Response, next: NextFunction) {
  const sessao = req.session as any;
  if (sessao && sessao.userId) {
    return next();
  }
  req.flash('error_msg', 'Por favor, faça login para ver as tarefas.');
  res.redirect('/login');
}

// Aplica a proteção em todas as rotas abaixo
router.use(garantirAutenticacao);

// Lista apenas as tarefas criadas pelo ID do usuário logado
router.get('/', (req: Request, res: Response) => {
  const sessao = req.session as any;
  const tarefasFiltradas = tarefasDB.filter(t => t.userId === sessao.userId);
  res.render('tarefas', { tarefas: tarefasFiltradas });
});

// Cria uma nova tarefa associada ao usuário
router.post('/nova', (req: Request, res: Response) => {
  const { titulo } = req.body;
  const sessao = req.session as any;

  if (!titulo || titulo.trim() === '') {
    req.flash('error_msg', 'Escreva algo para adicionar a tarefa!');
    return res.redirect('/tarefas');
  }

  const novaTarefa: Tarefa = {
    id: Date.now().toString(),
    userId: sessao.userId,
    titulo: titulo.trim(),
    concluida: false
  };

  tarefasDB.push(novaTarefa);
  req.flash('success_msg', 'Tarefa adicionada com sucesso!');
  res.redirect('/tarefas');
});

export default router;