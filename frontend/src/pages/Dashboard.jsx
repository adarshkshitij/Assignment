import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { getApiError, sanitizeText } from '../utils/form';

const buildDerivedStats = (taskList) =>
  taskList.reduce((acc, task) => {
    const priority = task.priority || 'medium';
    const existing = acc.find(
      (item) => item._id.status === task.status && item._id.priority === priority
    );

    if (existing) {
      existing.count += 1;
    } else {
      acc.push({
        _id: {
          status: task.status,
          priority,
        },
        count: 1,
      });
    }

    return acc;
  }, []);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.successMessage || '');

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (location.state?.successMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority, sortBy]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError('');

    try {
      let url = `/tasks?sort=${sortBy}`;

      if (filterStatus) url += `&status=${filterStatus}`;
      if (filterPriority) url += `&priority=${filterPriority}`;

      const res = await api.get(url);
      const taskList = res.data.data;

      setTasks(taskList);

      if (user.role === 'admin') {
        const statsRes = await api.get('/tasks/stats');
        setStats(statsRes.data.data);
      } else {
        setStats(buildDerivedStats(taskList));
      }
    } catch (err) {
      setError(getApiError(err, 'Failed to fetch data'));
    }

    setLoading(false);
  };

  const handleOpenModal = (task = null) => {
    setError('');

    if (task) {
      setCurrentTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority || 'medium');
    } else {
      setCurrentTask(null);
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanTitle = sanitizeText(title);
    const cleanDescription = sanitizeText(description);

    if (!cleanTitle || !cleanDescription) {
      setError('Title and description are required');
      return;
    }

    try {
      const payload = {
        title: cleanTitle,
        description: cleanDescription,
        status,
        priority,
      };

      if (currentTask) {
        await api.put(`/tasks/${currentTask._id}`, payload);
        setSuccess('Task updated successfully');
      } else {
        await api.post('/tasks', payload);
        setSuccess('Task created successfully');
      }

      handleCloseModal();
      fetchTasks();
    } catch (err) {
      setError(getApiError(err, 'Failed to save task'));
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await api.delete(`/tasks/${id}`);
      setSuccess('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      setError(getApiError(err, 'Failed to delete task'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', {
      replace: true,
      state: { successMessage: 'Signed out successfully' },
    });
  };

  const totalTasks = stats.reduce((acc, curr) => acc + curr.count, 0);
  const highPriority = stats
    .filter((item) => item._id.priority === 'high')
    .reduce((acc, curr) => acc + curr.count, 0);
  const completedTasks = stats
    .filter((item) => item._id.status === 'completed')
    .reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="app-wrapper">
      <div className="liquid-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <nav className="navbar glass-effect">
        <div className="container">
          <div className="nav-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="brand-icon"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
            <span className="brand-text">Primetrade<span className="brand-accent">AI</span></span>
          </div>
          <div className="nav-user">
            <button onClick={toggleTheme} className="btn outline-btn btn-sm btn-auto" style={{ padding: '0.4rem 0.6rem' }} title="Toggle Theme">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>{user.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-logout btn-sm btn-auto">Sign Out</button>
          </div>
        </div>
      </nav>

      <main className="dashboard container">
        <div className="dashboard-header animate-fade-in">
          <div>
            <h1>Task Intelligence</h1>
            <p className="subtitle">Real-time tracking for your operational workflows.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn btn-primary btn-auto neon-shadow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Task
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="metrics-grid animate-slide-up">
          <div className="metric-card">
            <div className="metric-icon blue-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            <div className="metric-content">
              <h3>Total Tasks</h3>
              <div className="metric-value">{totalTasks}</div>
            </div>
          </div>

          <div className="metric-card attention">
            <div className="metric-icon red-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <div className="metric-content">
              <h3>Critical Priority</h3>
              <div className="metric-value">{highPriority}</div>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon green-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div className="metric-content">
              <h3>Yield (Completed)</h3>
              <div className="metric-value">{completedTasks}</div>
            </div>
          </div>
        </div>

        <div className="filter-bar glass-effect animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="filter-group">
            <label>Status Filter</label>
            <div className="select-wrapper">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="filter-group">
            <label>Priority Target</label>
            <div className="select-wrapper">
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="">All Priorities</option>
                <option value="high">High (Critical)</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="filter-group">
            <label>Data Order</label>
            <div className="select-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="priority">Priority (Low to High)</option>
                <option value="-priority">Priority (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="spinner" />
            <p>Syncing data...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
            </div>
            <h3>No Tasks Found</h3>
            <p>Your workspace is clear. Create a new task to begin tracking.</p>
          </div>
        ) : (
          <div className="task-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {tasks.map((task) => (
              <div key={task._id} className={`task-card prio-${task.priority || 'medium'}`}>
                <div className="task-header">
                  <span className={`badge-status status-${task.status}`}>
                    <span className="status-dot" />
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`badge-priority prio-${task.priority || 'medium'}`}>
                    {task.priority || 'medium'}
                  </span>
                </div>

                <h3 className="task-title">{task.title}</h3>
                <p className="task-desc">{task.description}</p>

                <div className="task-meta">
                  <div className="meta-left">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </div>
                  {user.role === 'admin' && (
                    <div className="meta-owner">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      {task.user?.name || 'User Data'}
                    </div>
                  )}
                </div>

                <div className="task-actions">
                  <button onClick={() => handleOpenModal(task)} className="action-btn edit-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)} className="action-btn delete-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal glass-effect neon-border">
            <h2>{currentTask ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={handleSaveTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Server Migration" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" placeholder="Define the task..." />
              </div>
              <div className="form-row">
                <div className="form-group half-width">
                  <label>Status</label>
                  <div className="select-wrapper">
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="form-group half-width">
                  <label>Priority</label>
                  <div className="select-wrapper">
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn outline-btn btn-auto">Cancel</button>
                <button type="submit" className="btn btn-primary btn-auto neon-shadow">
                  {currentTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
