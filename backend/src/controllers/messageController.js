const db = require('../database');

class MessageController {
    async sendMessage(req, res) {
        try {
            console.log('📨 Recebendo mensagem para grupo:', req.params.groupId);
            console.log('👤 Usuário:', req.userId);
            console.log('💬 Mensagem:', req.body.message);

            const { groupId } = req.params;
            const { message } = req.body;
            const userId = req.userId;

            if (!message || message.trim() === '') {
                return res.status(400).json({ error: 'Mensagem não pode estar vazia' });
            }

            // Verificar se usuário é membro do grupo
            db.get(
                'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
                [groupId, userId],
                (err, isMember) => {
                    if (err) {
                        console.error('❌ Erro ao verificar membro:', err);
                        return res.status(500).json({ error: 'Erro interno' });
                    }
                    
                    if (!isMember) {
                        console.log('❌ Usuário não é membro do grupo');
                        return res.status(403).json({ error: 'Você não é membro deste grupo' });
                    }

                    console.log('✅ Usuário é membro, inserindo mensagem...');

                    // Inserir mensagem
                    db.run(
                        'INSERT INTO group_messages (group_id, user_id, message) VALUES (?, ?, ?)',
                        [groupId, userId, message.trim()],
                        function(err) {
                            if (err) {
                                console.error('❌ Erro ao inserir mensagem:', err);
                                return res.status(500).json({ error: 'Erro ao enviar mensagem' });
                            }

                            console.log('✅ Mensagem inserida com ID:', this.lastID);

                            // Buscar mensagem com dados do usuário
                            db.get(
                                `SELECT gm.*, u.name as user_name 
                                 FROM group_messages gm 
                                 JOIN users u ON gm.user_id = u.id 
                                 WHERE gm.id = ?`,
                                [this.lastID],
                                (err, newMessage) => {
                                    if (err) {
                                        console.error('❌ Erro ao buscar mensagem:', err);
                                        return res.status(500).json({ error: 'Erro ao recuperar mensagem' });
                                    }
                                    console.log('✅ Mensagem retornada com sucesso');
                                    res.status(201).json(newMessage);
                                }
                            );
                        }
                    );
                }
            );
        } catch (error) {
            console.error('💥 Erro no sendMessage:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getMessages(req, res) {
        try {
            console.log('📥 Buscando mensagens do grupo:', req.params.groupId);
            
            const { groupId } = req.params;
            const userId = req.userId;

            // Verificar se usuário é membro do grupo
            db.get(
                'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
                [groupId, userId],
                (err, isMember) => {
                    if (err) {
                        console.error('❌ Erro ao verificar membro:', err);
                        return res.status(500).json({ error: 'Erro interno' });
                    }
                    
                    if (!isMember) {
                        console.log('❌ Acesso negado - não é membro');
                        return res.status(403).json({ error: 'Acesso negado' });
                    }

                    console.log('✅ Buscando mensagens...');

                    // Buscar mensagens
                    db.all(
                        `SELECT gm.*, u.name as user_name 
                         FROM group_messages gm 
                         JOIN users u ON gm.user_id = u.id 
                         WHERE gm.group_id = ? 
                         ORDER BY gm.created_at ASC`, // Mudado para ASC para ordem cronológica
                        [groupId],
                        (err, messages) => {
                            if (err) {
                                console.error('❌ Erro ao buscar mensagens:', err);
                                return res.status(500).json({ error: 'Erro ao buscar mensagens' });
                            }
                            console.log(`✅ ${messages.length} mensagens encontradas`);
                            res.json(messages);
                        }
                    );
                }
            );
        } catch (error) {
            console.error('💥 Erro no getMessages:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new MessageController();