const db = require('../database');

class GroupController {
    // Criar grupo
    async createGroup(req, res) {
        try {
            const { name, description, subject, max_participants } = req.body;
            const created_by = req.userId;

            if (!name || !subject) {
                return res.status(400).json({ error: 'Nome e disciplina são obrigatórios' });
            }

            db.run(
                `INSERT INTO groups (name, description, subject, max_participants, created_by) 
                 VALUES (?, ?, ?, ?, ?)`,
                [name, description, subject, max_participants || 10, created_by],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Erro ao criar grupo' });
                    }

                    // Adicionar criador como membro
                    db.run(
                        'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
                        [this.lastID, created_by],
                        (err) => {
                            if (err) {
                                console.error('Erro ao adicionar criador como membro:', err);
                            }
                        }
                    );

                    res.status(201).json({
                        id: this.lastID,
                        name,
                        description,
                        subject,
                        max_participants: max_participants || 10,
                        current_participants: 1,
                        created_by
                    });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Buscar grupos com filtros
    async searchGroups(req, res) {
        try {
            const { subject, search, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            let query = `
                SELECT g.*, u.name as creator_name, 
                       (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) as current_participants
                FROM groups g
                LEFT JOIN users u ON g.created_by = u.id
                WHERE 1=1
            `;
            let params = [];

            if (subject) {
                query += ' AND g.subject = ?';
                params.push(subject);
            }

            if (search) {
                query += ' AND (g.name LIKE ? OR g.description LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            query += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            db.all(query, params, (err, groups) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao buscar grupos' });
                }

                // Contar total para paginação
                let countQuery = 'SELECT COUNT(*) as total FROM groups WHERE 1=1';
                let countParams = [];

                if (subject) {
                    countQuery += ' AND subject = ?';
                    countParams.push(subject);
                }

                if (search) {
                    countQuery += ' AND (name LIKE ? OR description LIKE ?)';
                    countParams.push(`%${search}%`, `%${search}%`);
                }

                db.get(countQuery, countParams, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erro ao contar grupos' });
                    }

                    res.json({
                        groups,
                        pagination: {
                            current: parseInt(page),
                            total: Math.ceil(result.total / limit),
                            total_items: result.total
                        }
                    });
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Participar de grupo
    async joinGroup(req, res) {
        try {
            const { groupId } = req.params;
            const userId = req.userId;

            // Verificar se grupo existe e tem vagas
            db.get(
                `SELECT g.*, COUNT(gm.id) as current_participants 
                 FROM groups g 
                 LEFT JOIN group_members gm ON g.id = gm.group_id 
                 WHERE g.id = ? 
                 GROUP BY g.id`,
                [groupId],
                (err, group) => {
                    if (err || !group) {
                        return res.status(404).json({ error: 'Grupo não encontrado' });
                    }

                    if (group.current_participants >= group.max_participants) {
                        return res.status(400).json({ error: 'Grupo lotado' });
                    }

                    // Verificar se já é membro
                    db.get(
                        'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
                        [groupId, userId],
                        (err, existingMember) => {
                            if (existingMember) {
                                return res.status(400).json({ error: 'Você já é membro deste grupo' });
                            }

                            // Adicionar como membro
                            db.run(
                                'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
                                [groupId, userId],
                                function(err) {
                                    if (err) {
                                        return res.status(500).json({ error: 'Erro ao entrar no grupo' });
                                    }

                                    // Criar notificação
                                    db.run(
                                        `INSERT INTO notifications (user_id, group_id, type, message) 
                                         VALUES (?, ?, ?, ?)`,
                                        [group.created_by, groupId, 'new_member', 
                                         `Novo membro entrou no grupo ${group.name}`]
                                    );

                                    res.json({ message: 'Você entrou no grupo com sucesso!' });
                                }
                            );
                        }
                    );
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Listar membros do grupo
    async getGroupMembers(req, res) {
        try {
            const { groupId } = req.params;

            db.all(
                `SELECT u.id, u.name, u.email, gm.joined_at 
                 FROM group_members gm 
                 JOIN users u ON gm.user_id = u.id 
                 WHERE gm.group_id = ? 
                 ORDER BY gm.joined_at`,
                [groupId],
                (err, members) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erro ao buscar membros' });
                    }

                    res.json(members);
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new GroupController();