import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { usuariosDB, User } from '../models/userModel';

const router = Router();

// Exibe a página de login
router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

// Executa a validação do login
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  const usuario = usuariosDB.find(u => u.email === email);
  if (!usuario) {
    req.flash('error_msg', 'E-mail ou senha incorretos.');
    return res.redirect('/login');
  }

  // Compara a senha criptografada usando bcrypt
  const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaCorreta) {
    req.flash('error_msg', 'E-mail ou senha incorretos.');
    return res.redirect('/login');
  }

  // Guarda as informações na sessão do usuário
  const sessao = req.session as any;
  sessao.userId = usuario.id;
  sessao.userName = usuario.nome;

  req.flash('success_msg', 'Logado com sucesso!');
  res.redirect('/tarefas');
});

// Exibe a página de cadastro
router.get('/registro', (req: Request, res: Response) => {
  res.render('registro');
});

// Executa a criação de uma nova conta
router.post('/registro', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  // Impede e-mails duplicados
  const emailExiste = usuariosDB.some(u => u.email === email);
  if (emailExiste) {
    req.flash('error_msg', 'Este e-mail já está sendo usado.');
    return res.redirect('/registro');
  }

  try {
    // Aplica criptografia na senha do usuário
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario: User = {
      id: Date.now().toString(),
      nome,
      email,
      senhaHash
    };

    usuariosDB.push(novoUsuario);

    req.flash('success_msg', 'Conta criada com sucesso! Faça seu login.');
    res.redirect('/login');
  } catch (e) {
    req.flash('error_msg', 'Erro ao criar conta.');
    res.redirect('/registro');
  }
});

// Desconecta o usuário
router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

export default router;