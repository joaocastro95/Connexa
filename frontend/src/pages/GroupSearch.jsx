import React, { useState, useEffect } from 'react';
import { groupsAPI } from '../services/api';

const GroupSearch = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    search: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    searchGroups();
  }, [filters.page]);

  const searchGroups = async () => {
    setLoading(true);
    try {
      const response = await groupsAPI.search(filters);
      setGroups(response.data.groups);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchGroups();
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await groupsAPI.join(groupId);
      alert('Você entrou no grupo com sucesso!');
      searchGroups(); // Atualizar lista
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao entrar no grupo');
    }
  };

  const subjects = [
    'Matemática', 'Física', 'Química', 'Biologia', 'História', 
    'Geografia', 'Português', 'Inglês', 'Programação', 'Outros'
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Buscar Grupos de Estudo</h1>
        <p style={styles.subtitle}>Encontre o grupo perfeito para seus estudos</p>
      </div>

      {/* Filtros */}
      <div style={styles.filtersCard}>
        <form onSubmit={handleSearch} style={styles.filtersForm}>
          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Disciplina</label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">Todas as disciplinas</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Buscar</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nome ou descrição do grupo..."
                style={styles.filterInput}
              />
            </div>

            <button type="submit" style={styles.searchBtn}>
              🔍 Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Resultados */}
      <div style={styles.resultsSection}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Buscando grupos...</p>
          </div>
        ) : (
          <>
            <div style={styles.resultsHeader}>
              <h2>
                {groups.length === 0 ? 'Nenhum grupo encontrado' : `${groups.length} grupo(s) encontrado(s)`}
              </h2>
            </div>

            <div style={styles.groupsGrid}>
              {groups.map(group => (
                <div key={group.id} style={styles.groupCard}>
                  <div style={styles.groupHeader}>
                    <h3 style={styles.groupName}>{group.name}</h3>
                    <span style={styles.groupSubject}>{group.subject}</span>
                  </div>
                  
                  <p style={styles.groupDescription}>
                    {group.description || 'Sem descrição'}
                  </p>

                  <div style={styles.groupStats}>
                    <span>👥 {group.current_participants}/{group.max_participants} membros</span>
                    <span>Criado por: {group.creator_name}</span>
                  </div>

                  <div style={styles.groupActions}>
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      style={styles.joinBtn}
                      disabled={group.current_participants >= group.max_participants}
                    >
                      {group.current_participants >= group.max_participants ? 'Grupo Lotado' : 'Participar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {pagination.total > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={filters.page <= 1}
                  style={styles.paginationBtn}
                >
                  ← Anterior
                </button>
                
                <span style={styles.paginationInfo}>
                  Página {filters.page} de {pagination.total}
                </span>
                
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={filters.page >= pagination.total}
                  style={styles.paginationBtn}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: 1200,
    margin: '0 auto',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
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
  filtersCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  filtersForm: {
    width: '100%',
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '1rem',
    alignItems: 'end',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterLabel: {
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#374151',
  },
  filterSelect: {
    padding: '10px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
  },
  filterInput: {
    padding: '10px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
  },
  searchBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    height: 'fit-content',
  },
  resultsSection: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  resultsHeader: {
    marginBottom: '2rem',
  },
  groupsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  groupCard: {
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    borderRadius: '8px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  groupName: {
    fontSize: '1.3rem',
    color: '#1e293b',
    margin: 0,
  },
  groupSubject: {
    background: '#667eea',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  groupDescription: {
    color: '#64748b',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  groupStats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  groupActions: {
    display: 'flex',
    gap: '1rem',
  },
  joinBtn: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: 1,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e5e7eb',
  },
  paginationBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  paginationInfo: {
    color: '#64748b',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
};

export default GroupSearch;