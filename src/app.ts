import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import authRoutes from './routes/authRoutes';
import tarefaRoutes from './routes/tarefaRoutes';
import adminRoutes from './routes/adminRoutes'; // Novo arquivo de rotas do administrador

const app = express();

// Configuração do View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mapeamento de ficheiros estáticos (CSS, Imagens, JS do lado do cliente)
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares cruciais para capturar e ler os dados dos formulários HTML (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do express-session para gerir o estado de login
app.use(
  session({
    secret: 'chave_secreta_guards_tarefas_9876',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Mantém a sessão ativa por 1 dia
  })
);

// Ativação das mensagens de feedback temporárias (Flash)
app.use(flash());

// Middleware Global: Injeta mensagens flash e dados do utilizador autenticado em todas as Views (.ejs)
app.use((req, res, next) => {
  // Com o arquivo src/types/session.d.ts configurado, não precisará do 'as any'
  const sessao = req.session as any; 

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  
  // Disponibiliza as informações do utilizador e da sua Role para o EJS decidir o que renderizar
  res.locals.user = sessao.userId ? { 
    id: sessao.userId, 
    name: sessao.userName, 
    role: sessao.userRole 
  } : null;
  
  next();
});

// Associação e registo das rotas da aplicação
app.use('/', authRoutes);
app.use('/tarefas', tarefaRoutes);
app.use('/admin', adminRoutes); // Conecta o painel administrativo à rota /admin

// Redirecionamento automático da rota raiz para a página de login
app.get('/', (req, res) => {
  res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado com sucesso em http://localhost:${PORT}`);
});

export default app;