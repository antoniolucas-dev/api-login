import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { usuariosDB, User, Role } from '../models/userModel';

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const usuario = usuariosDB.find(u => u.email === email);

  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    req.flash('error_msg', 'E-mail ou senha incorretos.');
    return res.redirect('/login');
  }

  const sessao = req.session as any;
  sessao.userId = usuario.id;
  sessao.userName = usuario.nome;
  sessao.userRole = usuario.role; // SALVA A ROLE NA SESSÃO DO EXPRESS

  req.flash('success_msg', `Bem-vindo, ${usuario.nome}!`);
  
  // Se for ADMIN, pode redirecionar direto para o painel se quiser, ou para tarefas
  res.redirect('/tarefas');
});

router.get('/registro', (req: Request, res: Response) => {
  res.render('registro');
});

router.post('/registro', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;
  const emailExiste = usuariosDB.some(u => u.email === email);

  if (emailExiste) {
    req.flash('error_msg', 'Este e-mail já está em uso.');
    return res.redirect('/registro');
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    // REGRA: Se o banco estiver vazio, o primeiro é ADMIN. Os próximos são USER.
    const definirRole = usuariosDB.length === 0 ? Role.ADMIN : Role.USER;

    const novoUsuario: User = {
      id: Date.now().toString(),
      nome,
      email,
      senhaHash,
      role: definirRole
    };

    usuariosDB.push(novoUsuario);

    const msgSucesso = definirRole === Role.ADMIN 
      ? 'Primeira conta criada como ADMINISTRADOR! Faça login.' 
      : 'Conta criada com sucesso! Faça login.';

    req.flash('success_msg', msgSucesso);
    res.redirect('/login');
  } catch (e) {
    req.flash('error_msg', 'Erro ao criar conta.');
    res.redirect('/registro');
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

export default router;