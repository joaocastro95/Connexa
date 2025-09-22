# 🎓 Connexa - Plataforma de Grupos de Estudo
Plataforma colaborativa para criação e gestão de grupos de estudo universitários.

## 🚀 Funcionalidades Principais

- ✅ **Autenticação segura** com JWT
- ✅ **Criação de grupos** de estudo por disciplina
- ✅ **Busca inteligente** com filtros por disciplina e texto
- ✅ **Sistema de participação** em grupos
- ✅ **Dashboard personalizado** com notificações
- ✅ **Interface responsiva** com React
- ✅ **Banco de dados** SQLite integrado

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + Express.js
- **JWT** para autenticação
- **SQLite** com driver nativo
- **bcryptjs** para hash de senhas
- **CORS** habilitado

### Frontend
- **React 18** com hooks
- **React Router DOM** para navegação
- **Axios** para consumo de API
- **Vite** como build tool
- **CSS puro** com design responsivo

## 📦 Estrutura do Projeto

```
├── .gitignore
├── README.md
├── backend
    ├── package-lock.json
    ├── package.json
    └── src
    │   ├── controllers
    │       ├── authController.js
    │       └── groupController.js
    │   ├── database.js
    │   ├── middleware
    │       └── auth.js
    │   ├── routes
    │       ├── auth.js
    │       ├── groups.js
    │       └── notifications.js
    │   └── server.js
├── database
    ├── init.js
    └── schema.sql
└── frontend
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── src
        ├── App.jsx
        ├── components
        │   └── Navbar.jsx
        ├── index.css
        ├── main.jsx
        ├── pages
        │   ├── Dashboard.jsx
        │   ├── GroupCreate.jsx
        │   ├── GroupSearch.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        └── services
        │   ├── api.js
        │   └── auth.js
    └── vite.config.js
```

--------------- 

## 🏁 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Git

## 1. Clone o repositório
git clone https://github.com/joaocastro95/Connexa.git
cd Connexa


## 2. Configure o Backend

### Entre na pasta do backend
cd backend

### Instale as dependências
npm install

### Inicie o servidor de desenvolvimento
npm run dev


## 3. Configure o Frontend

### Abra outro terminal na pasta raiz
cd frontend

### Instale as dependências
npm install

### Inicie o servidor de desenvolvimento
npm run dev


## 4. Acesse a aplicação
Abra http://localhost:3000 no navegador.


--------------- 



## 👤 Primeiro Acesso
- Clique em "Cadastre-se aqui" na página de login
- Use qualquer e-mail válido (ex: seu.email@gmail.com)
- Senha mínima: 6 caracteres

## 📡 API Endpoints
### Autenticação
- POST /api/auth/login - Login de usuário
- POST /api/auth/register - Registro de usuário

### Grupos
- GET /api/groups/search - Buscar grupos com filtros
- POST /api/groups - Criar novo grupo
- POST /api/groups/:id/join - Participar de grupo

### Notificações
- GET /api/notifications - Listar notificações
- PUT /api/notifications/:id/read - Marcar como lida


--------------- 



## 🚀 Scripts Disponíveis
### Backend
npm run dev      # Modo desenvolvimento com nodemon
npm start        # Modo produção

### Frontend
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build




## 👨‍💻 Desenvolvido por

| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/132524175?v=4" width=115><br><sub>João Castro</sub>](https://github.com/joaocastro95) |
| --- |