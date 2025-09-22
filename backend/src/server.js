const express = require('express');
const cors = require('cors');
const path = require('path');
const messageRoutes = require('./routes/messages');

// Importar rotas
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const notificationRoutes = require('./routes/notifications'); 

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/groups', messageRoutes); 

// Rota health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Connexa API está funcionando!' });
});

// Servir React app em produção
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});