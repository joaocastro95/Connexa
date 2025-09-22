const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');

const JWT_SECRET = 'connexa-mvp-super-secret-key';

class AuthController {
    // Login de usuário
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
            }

            // ✅ VALIDAÇÃO FLEXÍVEL - Aceita qualquer e-mail válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Formato de e-mail inválido' });
            }

            // Buscar usuário
            db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
                if (err) {
                    console.error('Erro no login:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                if (!user) {
                    return res.status(401).json({ error: 'E-mail ou senha incorretos' });
                }

                // Verificar senha
                const validPassword = await bcrypt.compare(password, user.password_hash);
                if (!validPassword) {
                    return res.status(401).json({ error: 'E-mail ou senha incorretos' });
                }

                // Gerar JWT
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Registrar usuário
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            if (password.length < 6) {
                return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
            }

            // ✅ VALIDAÇÃO FLEXÍVEL
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Formato de e-mail inválido' });
            }

            // Verificar se usuário já existe
            db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
                if (err) {
                    console.error('Erro no registro:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                if (existingUser) {
                    return res.status(400).json({ error: 'Usuário já existe' });
                }

                // Hash da senha
                const saltRounds = 10;
                const passwordHash = await bcrypt.hash(password, saltRounds);

                // Inserir usuário
                db.run(
                    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
                    [name, email, passwordHash],
                    function(err) {
                        if (err) {
                            console.error('Erro ao criar usuário:', err);
                            return res.status(500).json({ error: 'Erro ao criar usuário' });
                        }

                        const token = jwt.sign(
                            { id: this.lastID, email },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );

                        res.status(201).json({
                            token,
                            user: {
                                id: this.lastID,
                                name,
                                email
                            }
                        });
                    }
                );
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new AuthController();