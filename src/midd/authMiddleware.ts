import { Request, Response, NextFunction } from 'express';

export function garantirAutenticacao(req: Request, res: Response, next: NextFunction) {
  // Verifica se o usuário está logado na sessão
  if (req.session && req.session.userId) {
    return next();
  }
  
  // Se não estiver logado, envia mensagem de erro e redireciona
  req.flash('error_msg', 'Por favor, faça login para acessar esta página.');
  res.redirect('/login');
}