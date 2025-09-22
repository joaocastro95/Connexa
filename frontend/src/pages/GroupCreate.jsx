import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupsAPI } from '../services/api';

const GroupCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    max_participants: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const subjects = [
    'Matemática', 'Física', 'Química', 'Biologia', 'História',
    'Geografia', 'Português', 'Inglês', 'Programação', 'Outros'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await groupsAPI.create(formData);
      alert('Grupo criado com sucesso!');
      navigate('/groups');
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao criar grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Criar Novo Grupo de Estudo</h1>
          <p style={styles.subtitle}>
            Compartilhe conhecimento e estude em grupo
          </p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Nome do Grupo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ex: Grupo de Estudo de Cálculo I"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="subject" style={styles.label}>
              Disciplina *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Selecione uma disciplina</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>
              Descrição do Grupo
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={styles.textarea}
              placeholder="Descreva o propósito do grupo, temas de estudo, frequência de encontros..."
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="max_participants" style={styles.label}>
              Número Máximo de Participantes
            </label>
            <input
              type="number"
              id="max_participants"
              name="max_participants"
              value={formData.max_participants}
              onChange={handleChange}
              min="2"
              max="50"
              style={styles.input}
            />
            <small style={styles.helpText}>
              Número máximo de membros que podem participar do grupo
            </small>
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate('/groups')}
              style={styles.cancelBtn}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading && styles.submitBtnDisabled)
              }}
            >
              {loading ? 'Criando Grupo...' : 'Criar Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  card: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1.1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'white',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  helpText: {
    display: 'block',
    marginTop: '0.5rem',
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  cancelBtn: {
    background: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  submitBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.3s ease',
  },
  submitBtnDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
};

export default GroupCreate;