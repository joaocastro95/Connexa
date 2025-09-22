const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/connexa.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
    } else {
        console.log('✅ Conectado ao SQLite.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Criar TODAS as tabelas manualmente
    const createTables = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            subject VARCHAR(50),
            max_participants INTEGER DEFAULT 10,
            current_participants INTEGER DEFAULT 0,
            created_by INTEGER REFERENCES users(id),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS group_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(group_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            group_id INTEGER REFERENCES groups(id),
            type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS illusion_calculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            calculation_data TEXT,
            result DECIMAL(10,2),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS group_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id),
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;

    db.exec(createTables, (err) => {
        if (err) {
            console.error('❌ Erro ao criar tabelas:', err);
        } else {
            console.log('✅ Todas as tabelas criadas com sucesso!');
            
            // Criar índices
            db.exec(`
                CREATE INDEX IF NOT EXISTS idx_groups_subject ON groups(subject);
                CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at);
                CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
                CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
                CREATE INDEX IF NOT EXISTS idx_group_messages_group ON group_messages(group_id);
                CREATE INDEX IF NOT EXISTS idx_group_messages_created ON group_messages(created_at);
            `, (idxErr) => {
                if (idxErr) {
                    console.error('❌ Erro ao criar índices:', idxErr);
                } else {
                    console.log('✅ Índices criados com sucesso!');
                }
            });
        }
    });
}

module.exports = db;