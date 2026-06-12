import { Request, Response, NextFunction } from 'express';
import { Role } from '../models/userModel';

// Middleware para verificar se o usuário está logado (Session)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessao = req.session as any;
  if (sessao && sessao.userId) {
    return next();
  }
  req.flash('error_msg', 'Por favor, faça login para acessar esta página.');
  res.redirect('/login');
}

// Middleware dinâmico para verificar a Role do usuário
export function requireRole(rolePermitida: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const sessao = req.session as any;
    
    // Verifica se está logado e se a role na sessão bate com a permitida
    if (sessao && sessao.userRole === rolePermitida) {
      return next();
    }
    
    req.flash('error_msg', 'Acesso negado: Você não tem permissão de Administrador.');
    res.redirect('/tarefas');
  };
}