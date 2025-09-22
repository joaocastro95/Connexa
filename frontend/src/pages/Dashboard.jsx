import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupsAPI, notificationsAPI } from '../services/api';
import { authService } from '../services/auth';

const Dashboard = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar grupos do usuário
      const groupsResponse = await groupsAPI.search({ myGroups: true });
      setUserGroups(groupsResponse.data.groups || []);

      // Carregar notificações
      const notificationsResponse = await notificationsAPI.list();
      setNotifications(notificationsResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Bem-vindo, {currentUser?.name}!</h1>
        <p style={styles.subtitle}>Seu hub de grupos de estudo</p>
      </div>

      <div style={styles.grid}>
        {/* Meus Grupos */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>Meus Grupos</h2>
            <Link to="/create-group" style={styles.createBtn}>
              Criar Novo Grupo
            </Link>
          </div>

          {userGroups.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Você ainda não participa de nenhum grupo</p>
              <Link to="/groups" style={styles.exploreBtn}>
                Explorar Grupos
              </Link>
            </div>
          ) : (
            <div style={styles.groupsGrid}>
              {userGroups.slice(0, 6).map(group => (
                <div key={group.id} style={styles.groupCard}>
                  <h3 style={styles.groupName}>{group.name}</h3>
                  <p style={styles.groupSubject}>{group.subject}</p>
                  <div style={styles.groupInfo}>
                    <span>{group.current_participants}/{group.max_participants} membros</span>
                  </div>
                  <Link 
                    to={`/groups/${group.id}`} 
                    style={styles.viewGroupBtn}
                  >
                    Ver Grupo
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notificações */}
        <div style={styles.section}>
          <h2>Notificações Recentes</h2>
          {notifications.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div style={styles.notificationsList}>
              {notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id} 
                  style={{
                    ...styles.notificationItem,
                    ...(notification.is_read ? styles.read : styles.unread)
                  }}
                >
                  <p style={styles.notificationText}>{notification.message}</p>
                  <small style={styles.notificationTime}>
                    {new Date(notification.created_at).toLocaleDateString()}
                  </small>
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={styles.markReadBtn}
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estatísticas Rápidas */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Grupos Ativos</h3>
            <p style={styles.statNumber}>{userGroups.length}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Notificações</h3>
            <p style={styles.statNumber}>
              {notifications.filter(n => !n.is_read).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    color: 'white',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.8)',
  },
  grid: {
    display: 'grid',
    gap: '2rem',
  },
  section: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  createBtn: {
    background: '#10b981',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
  },
  groupsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  groupCard: {
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    borderRadius: '8px',
    transition: 'transform 0.2s ease',
  },
  groupName: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: '#1e293b',
  },
  groupSubject: {
    color: '#64748b',
    marginBottom: '1rem',
  },
  groupInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  viewGroupBtn: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  notificationItem: {
    padding: '1rem',
    borderLeft: '4px solid #667eea',
    background: '#f8fafc',
  },
  unread: {
    background: '#eff6ff',
    borderLeftColor: '#3b82f6',
  },
  read: {
    opacity: 0.7,
  },
  notificationText: {
    marginBottom: '0.5rem',
  },
  notificationTime: {
    color: '#64748b',
  },
  markReadBtn: {
    background: 'none',
    border: '1px solid #64748b',
    color: '#64748b',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '0.5rem 0 0 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b',
  },
  exploreBtn: {
    display: 'inline-block',
    background: '#667eea',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    marginTop: '1rem',
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
};

export default Dashboard;