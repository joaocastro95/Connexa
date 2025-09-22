const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../database');
const router = express.Router();

// Listar notificações do usuário
router.get('/', authMiddleware, (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    db.all(
        `SELECT n.*, g.name as group_name 
         FROM notifications n 
         LEFT JOIN groups g ON n.group_id = g.id 
         WHERE n.user_id = ? 
         ORDER BY n.created_at DESC 
         LIMIT ? OFFSET ?`,
        [req.userId, parseInt(limit), offset],
        (err, notifications) => {
            if (err) {
                console.error('Erro ao buscar notificações:', err);
                return res.status(500).json({ error: 'Erro ao buscar notificações' });
            }
            res.json(notifications);
        }
    );
});

// Marcar notificação como lida
router.put('/:id/read', authMiddleware, (req, res) => {
    db.run(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId],
        function(err) {
            if (err) {
                console.error('Erro ao atualizar notificação:', err);
                return res.status(500).json({ error: 'Erro ao atualizar notificação' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Notificação não encontrada' });
            }
            
            res.json({ message: 'Notificação marcada como lida' });
        }
    );
});

// Deletar notificação
router.delete('/:id', authMiddleware, (req, res) => {
    db.run(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId],
        function(err) {
            if (err) {
                console.error('Erro ao deletar notificação:', err);
                return res.status(500).json({ error: 'Erro ao deletar notificação' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Notificação não encontrada' });
            }
            
            res.json({ message: 'Notificação deletada com sucesso' });
        }
    );
});

module.exports = router;