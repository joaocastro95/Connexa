const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'connexa.db');
const db = new sqlite3.Database(dbPath);

async function initializeDatabase() {
    console.log('🎯 Inicializando banco de dados...');
    
    // Hash para senha padrão
    const defaultPassword = await bcrypt.hash('123456', 10);
    
    // Inserir usuário de exemplo
    db.run(
        `INSERT OR IGNORE INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
        ['João Silva', 'joao.silva@universidade.edu', defaultPassword],
        function(err) {
            if (err) {
                console.error('Erro ao criar usuário exemplo:', err);
            } else {
                console.log('✅ Usuário exemplo criado: joao.silva@universidade.edu / 123456');
            }
        }
    );
    
    // Inserir grupos de exemplo
    const sampleGroups = [
        {
            name: 'Grupo de Cálculo I',
            description: 'Estudo colaborativo para a disciplina de Cálculo I',
            subject: 'Matemática',
            max_participants: 8,
            created_by: 1
        },
        {
            name: 'Programação Web Avançada',
            description: 'Discutindo React, Node.js e boas práticas',
            subject: 'Programação',
            max_participants: 6,
            created_by: 1
        }
    ];
    
    sampleGroups.forEach(group => {
        db.run(
            `INSERT OR IGNORE INTO groups (name, description, subject, max_participants, created_by) 
             VALUES (?, ?, ?, ?, ?)`,
            [group.name, group.description, group.subject, group.max_participants, group.created_by],
            function(err) {
                if (err) {
                    console.error('Erro ao criar grupo exemplo:', err);
                }
            }
        );
    });
    
    console.log('🎉 Banco de dados inicializado com sucesso!');
}

// Executar inicialização
db.serialize(() => {
    initializeDatabase();
});

db.close();