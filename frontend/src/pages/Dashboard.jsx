import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority, sortBy]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      
      let url = `${API_URL}/tasks?sort=${sortBy}`;
      if (filterStatus) url += `&status=${filterStatus}`;
      if (filterPriority) url += `&priority=${filterPriority}`;
      
      const res = await axios.get(url, config);
      setTasks(res.data.data);

      const statsRes = await axios.get(`${API_URL}/tasks/stats`, config);
      setStats(statsRes.data.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleOpenModal = (task = null) => {
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
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      
      const payload = { title, description, status, priority };

      if (currentTask) {
        await axios.put(`${API_URL}/tasks/${currentTask._id}`, payload, config);
      } else {
        await axios.post(`${API_URL}/tasks`, payload, config);
      }
      
      handleCloseModal();
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        };
        await axios.delete(`${API_URL}/tasks/${id}`, config);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  // Calculate stats securely
  const totalTasks = stats.reduce((acc, curr) => acc + curr.count, 0);
  const highPriority = stats.filter(s => s._id.priority === 'high').reduce((acc, curr) => acc + curr.count, 0);
  const completedTasks = stats.filter(s => s._id.status === 'completed').reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="app-wrapper">
      <div className="liquid-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <nav className="navbar glass-effect">
        <div className="container">
          <div className="nav-brand">
            <svg /* icon */ width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="brand-icon"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <span className="brand-text">Primetrade<span className="brand-accent">AI</span></span>
          </div>
          <div className="nav-user">
            <button onClick={toggleTheme} className="btn outline-btn btn-sm btn-auto" style={{padding: '0.4rem 0.6rem'}} title="Toggle Theme">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>{user.role}</span>
            </div>
            <button onClick={logout} className="btn btn-logout btn-sm btn-auto">Sign Out</button>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Task
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="metrics-grid animate-slide-up">
          <div className="metric-card">
            <div className="metric-icon blue-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div className="metric-content">
              <h3>Total Tasks</h3>
              <div className="metric-value">{totalTasks}</div>
            </div>
          </div>
          
          <div className="metric-card attention">
            <div className="metric-icon red-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div className="metric-content">
              <h3>Critical Priority</h3>
              <div className="metric-value">{highPriority}</div>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon green-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="metric-content">
              <h3>Yield (Completed)</h3>
              <div className="metric-value">{completedTasks}</div>
            </div>
          </div>
        </div>

        <div className="filter-bar glass-effect animate-slide-up" style={{animationDelay: '0.1s'}}>
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
                <option value="-createdAt">Newest Genesis</option>
                <option value="createdAt">Oldest Genesis</option>
                <option value="priority">Priority (Low &rarr; High)</option>
                <option value="-priority">Priority (High &rarr; Low)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Syncing Data Nodes...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
            </div>
            <h3>No Data Found</h3>
            <p>Your workspace is clear. Create a new task to begin tracking.</p>
          </div>
        ) : (
          <div className="task-grid animate-slide-up" style={{animationDelay: '0.2s'}}>
            {tasks.map((task) => (
              <div key={task._id} className={`task-card prio-${task.priority || 'medium'}`}>
                <div className="task-header">
                  <span className={`badge-status status-${task.status}`}>
                    <span className="status-dot"></span>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '4px'}}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </div>
                  {user.role === 'admin' && (
                    <div className="meta-owner">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '4px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      {task.user.name || 'User Data'}
                    </div>
                  )}
                </div>
                
                <div className="task-actions">
                  <button onClick={() => handleOpenModal(task)} className="action-btn edit-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)} className="action-btn delete-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal glass-effect neon-border">
            <h2>{currentTask ? 'Edit Record' : 'Initialize Task'}</h2>
            <form onSubmit={handleSaveTask}>
              <div className="form-group">
                <label>Task Nomenclature</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Server Migration" />
              </div>
              <div className="form-group">
                <label>Operational Parameters (Description)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" placeholder="Define the task..."></textarea>
              </div>
              <div className="form-row">
                <div className="form-group half-width">
                  <label>Current Status</label>
                  <div className="select-wrapper">
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="form-group half-width">
                  <label>Priority Level</label>
                  <div className="select-wrapper">
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Critical)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn outline-btn btn-auto">Abort</button>
                <button type="submit" className="btn btn-primary btn-auto neon-shadow">Execute</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
