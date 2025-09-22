import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

const Navbar = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <h2>Connexa</h2>
        </Link>
        
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Dashboard</Link>
          <Link to="/groups" style={styles.navLink}>Buscar Grupos</Link>
          <Link to="/create-group" style={styles.navLink}>Criar Grupo</Link>
        </div>

        <div style={styles.userSection}>
          <span style={styles.userName}>Olá, {currentUser?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    textDecoration: 'none',
    color: '#667eea',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#1e293b',
    fontWeight: '500',
  },
  logoutBtn: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default Navbar;