import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { groupsAPI } from '../services/api';
import GroupChat from '../components/GroupChat';

const GroupDetails = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGroupData();
    }, [groupId]);

    const loadGroupData = async () => {
        try {
            // Carregar detalhes do grupo
            const groupResponse = await groupsAPI.search();
            const foundGroup = groupResponse.data.groups.find(g => g.id == groupId);
            setGroup(foundGroup);

            // Carregar membros do grupo
            const membersResponse = await groupsAPI.getMembers(groupId);
            setMembers(membersResponse.data);
        } catch (error) {
            console.error('Erro ao carregar grupo:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Carregando grupo...</p>
            </div>
        );
    }

    if (!group) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    <h2>Grupo não encontrado</h2>
                    <Link to="/groups" style={styles.backLink}>← Voltar para grupos</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Link to="/groups" style={styles.backLink}>← Voltar para grupos</Link>
                <h1 style={styles.title}>{group.name}</h1>
                <span style={styles.subject}>{group.subject}</span>
            </div>

            <div style={styles.grid}>
                <div style={styles.card}>
                    <h2>📋 Descrição</h2>
                    <p style={styles.description}>
                        {group.description || 'Sem descrição disponível.'}
                    </p>
                    
                    <div style={styles.stats}>
                        <div style={styles.stat}>
                            <strong>👥 Participantes:</strong> 
                            <span>{group.current_participants}/{group.max_participants}</span>
                        </div>
                        <div style={styles.stat}>
                            <strong>📅 Criado em:</strong> 
                            <span>{new Date(group.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={styles.stat}>
                            <strong>👤 Criador:</strong> 
                            <span>{group.creator_name}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2>👥 Membros do Grupo ({members.length})</h2>
                    <div style={styles.membersList}>
                        {members.map(member => (
                            <div key={member.id} style={styles.memberItem}>
                                <div style={styles.memberInfo}>
                                    <strong>{member.name}</strong>
                                    <small>Entrou em: {new Date(member.joined_at).toLocaleDateString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ✅ CHAT ADICIONADO AQUI */}
            <div style={styles.chatSection}>
                <GroupChat groupId={groupId} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: 1000,
        margin: '0 auto',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    backLink: {
        color: '#667eea',
        textDecoration: 'none',
        fontSize: '1.1rem',
        display: 'inline-block',
        marginBottom: '1rem',
    },
    title: {
        fontSize: '2.5rem',
        color: 'white',
        marginBottom: '0.5rem',
    },
    subject: {
        background: 'rgba(255,255,255,0.2)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '1.1rem',
    },
    grid: {
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: '1fr 1fr',
    },
    card: {
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
    description: {
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '1.5rem',
    },
    stats: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    stat: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #eee',
    },
    membersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxHeight: '400px',
        overflowY: 'auto',
    },
    memberItem: {
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
    },
    memberInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        color: 'white',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem',
    },
    error: {
        textAlign: 'center',
        padding: '3rem',
        color: 'white',
    },
    // ✅ ESTILO DO CHAT ADICIONADO
    chatSection: {
        marginTop: '2rem',
    },
};

export default GroupDetails;