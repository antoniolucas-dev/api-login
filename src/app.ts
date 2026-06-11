import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import authRoutes from './routes/authRoutes';
import tarefaRoutes from './routes/tarefaRoutes';

const app = express();

// Configuração do View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mapeia pastas de arquivos estáticos (CSS, imagens) se houver
app.use(express.static(path.join(__dirname, '../public')));

// Configurações cruciais para ler dados enviados pelos formulários HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do gerenciamento de sessões
app.use(
  session({
    secret: 'chave_secreta_tarefas_123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Mantém logado por 1 dia
  })
);

// Ativa as mensagens de feedback (Flash)
app.use(flash());

// Middleware Global: passa os dados para dentro de todas as telas (.ejs) automaticamente
app.use((req, res, next) => {
  const sessao = req.session as any;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = sessao.userId ? { id: sessao.userId, name: sessao.userName } : null;
  next();
});

// Vincula os arquivos de rotas do sistema
app.use('/', authRoutes);
app.use('/tarefas', tarefaRoutes);

// RESOLVE O "Cannot GET /": Se acessar a raiz, joga direto para o login
app.get('/', (req, res) => {
  res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando perfeitamente em http://localhost:${PORT}`);
});

export default app;