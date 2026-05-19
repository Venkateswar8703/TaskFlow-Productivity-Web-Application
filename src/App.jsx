import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatsView from './components/StatsView';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import TaskDetailsModal from './components/TaskDetailsModal';

// Sample default tasks to seed empty local storage on first load
const INITIAL_TASKS = [
  {
    id: 'seed-1',
    title: 'Design Landing Page UI',
    description: 'Create high-fidelity wireframes and prototype for the new TaskFlow homepage. Focus on modern typography and smooth dark mode styling.',
    category: 'work',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    completed: false,
    subtasks: [
      { id: 'sub-1', text: 'Gather reference designs', completed: true },
      { id: 'sub-2', text: 'Create style guide & color palette', completed: true },
      { id: 'sub-3', text: 'Draft high-fidelity layout', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'seed-2',
    title: 'Weekly Grocery Run',
    description: 'Pick up fresh produce and pantry essentials for the week.',
    category: 'shopping',
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0], // Today
    completed: false,
    subtasks: [
      { id: 'sub-4', text: 'Organic avocados and apples', completed: false },
      { id: 'sub-5', text: 'Whole wheat bread & oats', completed: false },
      { id: 'sub-6', text: 'Almond milk', completed: true }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-3',
    title: 'Annual Dental Checkup',
    description: 'Routine scaling and checkup at the clinic. Don\'t forget to bring health insurance card.',
    category: 'health',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // 7 days from now
    completed: false,
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'seed-4',
    title: 'Brainstorm Content Ideas',
    description: 'Jot down articles, reels, and video topics for next month\'s marketing campaign launch.',
    category: 'ideas',
    priority: 'medium',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago (overdue)
    completed: true,
    subtasks: [
      { id: 'sub-7', text: 'Write down 5 blog post titles', completed: true },
      { id: 'sub-8', text: 'Outline video scripting structure', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'seed-5',
    title: 'Refactor Styling Architecture',
    description: 'Clean up styling tokens and structure global CSS variables into the new index.css structure.',
    category: 'work',
    priority: 'medium',
    dueDate: '',
    completed: false,
    subtasks: [],
    createdAt: new Date().toISOString()
  }
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [activePriorityFilter, setActivePriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid');
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('taskflow_theme');
    return savedTheme || 'light';
  });

  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync tasks to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync theme to localStorage and body element attribute
  useEffect(() => {
    localStorage.setItem('taskflow_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleToggleComplete = (id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    // If the completed task is currently being viewed, update details modal view
    if (viewingTask && viewingTask.id === id) {
      setViewingTask(prev => ({ ...prev, completed: !prev.completed }));
    }
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map(sub => 
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          const updatedTask = { ...task, subtasks: updatedSubtasks };
          
          // Update details modal state if open
          if (viewingTask && viewingTask.id === taskId) {
            setViewingTask(updatedTask);
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      if (viewingTask && viewingTask.id === id) {
        setViewingTask(null);
      }
    }
  };

  const handleSaveTask = (taskData) => {
    const exists = tasks.some(task => task.id === taskData.id);
    if (exists) {
      setTasks(prevTasks => prevTasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTasks(prevTasks => [taskData, ...prevTasks]);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleOpenCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Filter tasks based on Search, Category, and Priority
  const filteredTasks = tasks.filter(task => {
    // 1. Search Query filter (matches Title or Description)
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Category filter
    const matchesCategory = activeFilter === 'all' || task.category === activeFilter;

    // 3. Priority filter
    const matchesPriority = activePriorityFilter === 'all' || task.priority === activePriorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    
    if (sortBy === 'dueDate') {
      // Tasks with no due date go to the bottom
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    if (sortBy === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }

    return 0;
  });

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter}
        activePriorityFilter={activePriorityFilter}
        setActivePriorityFilter={setActivePriorityFilter}
        tasks={tasks}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Panel */}
      <main className="main-content">
        {/* Header Actions */}
        <header className="main-header">
          <div className="search-bar">
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleOpenCreateForm}>
              ➕ Create Task
            </button>
          </div>
        </header>

        {/* Dynamic Stats View */}
        <StatsView tasks={tasks} />

        {/* View and Sorting Controls */}
        <div className="controls-panel">
          <div className="filter-group">
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Showing: {activeFilter} Tasks
            </span>
          </div>

          <div className="sort-group">
            <label className="form-label" style={{ margin: 0 }}>Sort By:</label>
            <select 
              className="select-control" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            <div className="view-modes">
              <button 
                type="button" 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                🎛️
              </button>
              <button 
                type="button" 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                📝
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Container */}
        {sortedTasks.length > 0 ? (
          <div className={viewMode === 'grid' ? 'tasks-grid' : 'tasks-list-layout'}>
            {sortedTasks.map(task => (
              <TaskCard 
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleOpenEditForm}
                onView={setViewingTask}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <h3 className="empty-state-title">No Tasks Found</h3>
            <p className="empty-state-desc">
              {searchQuery 
                ? "We couldn't find any tasks matching your search query. Try typing something else!" 
                : "It looks like there are no tasks in this category. Click 'Create Task' to get started!"}
            </p>
            {!searchQuery && (
              <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                Create Your First Task
              </button>
            )}
          </div>
        )}
      </main>

      {/* Task Form Modal (Create or Edit) */}
      {isFormOpen && (
        <TaskForm 
          key={editingTask ? editingTask.id : 'new'}
          task={editingTask}
          onSubmit={handleSaveTask}
          onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
        />
      )}

      {/* Task Details Modal */}
      {viewingTask && (
        <TaskDetailsModal 
          task={viewingTask}
          onToggleSubtask={handleToggleSubtask}
          onDelete={handleDeleteTask}
          onEdit={handleOpenEditForm}
          onClose={() => setViewingTask(null)}
        />
      )}
    </div>
  );
}

export default App;
