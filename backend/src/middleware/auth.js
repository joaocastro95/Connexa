const jwt = require('jsonwebtoken');

const JWT_SECRET = 'connexa-mvp-super-secret-key'; 

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;