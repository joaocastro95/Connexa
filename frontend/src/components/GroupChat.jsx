import React, { useState, useEffect, useRef } from 'react';
import { messagesAPI } from '../services/api';
import { authService } from '../services/auth';

const GroupChat = ({ groupId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        loadMessages();
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            const response = await messagesAPI.list(groupId);
            setMessages(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            await messagesAPI.send(groupId, newMessage);
            setNewMessage('');
            await loadMessages(); // Recarregar mensagens
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
                <h3>💬 Chat do Grupo</h3>
                <small>{messages.length} mensagens</small>
            </div>

            <div style={styles.messagesContainer}>
                {messages.length === 0 ? (
                    <div style={styles.emptyChat}>
                        <p>Nenhuma mensagem ainda. Seja o primeiro a conversar!</p>
                    </div>
                ) : (
                    messages.map(message => (
                        <div 
                            key={message.id} 
                            style={{
                                ...styles.messageItem,
                                ...(message.user_id === currentUser?.id && styles.ownMessage)
                            }}
                        >
                            <div style={styles.messageHeader}>
                                <strong>{message.user_name}</strong>
                                <span style={styles.messageTime}>
                                    {formatTime(message.created_at)}
                                </span>
                            </div>
                            <p style={styles.messageText}>{message.message}</p>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} style={styles.messageForm}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    style={styles.messageInput}
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    style={{
                        ...styles.sendButton,
                        ...(loading && styles.sendButtonDisabled)
                    }}
                    disabled={loading || !newMessage.trim()}
                >
                    {loading ? '⏳' : '📤'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    chatContainer: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
    },
    chatHeader: {
        background: '#667eea',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messagesContainer: {
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    messageItem: {
        background: '#f8f9fa',
        padding: '0.8rem',
        borderRadius: '8px',
        maxWidth: '80%',
    },
    ownMessage: {
        background: '#667eea',
        color: 'white',
        alignSelf: 'flex-end',
    },
    messageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
    },
    messageTime: {
        opacity: 0.7,
        fontSize: '0.8rem',
    },
    messageText: {
        margin: 0,
        lineHeight: '1.4',
    },
    emptyChat: {
        textAlign: 'center',
        color: '#6c757d',
        padding: '2rem',
    },
    messageForm: {
        display: 'flex',
        padding: '1rem',
        borderTop: '1px solid #e9ecef',
        gap: '0.5rem',
    },
    messageInput: {
        flex: 1,
        padding: '0.8rem',
        border: '1px solid #ced4da',
        borderRadius: '8px',
        fontSize: '1rem',
    },
    sendButton: {
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.8rem 1.2rem',
        cursor: 'pointer',
        fontSize: '1.2rem',
    },
    sendButtonDisabled: {
        background: '#ccc',
        cursor: 'not-allowed',
    },
};

export default GroupChat;