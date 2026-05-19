
const Sidebar = ({ 
  activeFilter, 
  setActiveFilter, 
  activePriorityFilter,
  setActivePriorityFilter,
  tasks, 
  theme, 
  onToggleTheme 
}) => {
  const categories = ['all', 'work', 'personal', 'shopping', 'health', 'ideas'];

  // Helper to count active tasks matching filter
  const getCount = (cat) => {
    if (cat === 'all') {
      return tasks.filter(t => !t.completed).length;
    }
    return tasks.filter(t => t.category === cat && !t.completed).length;
  };

  const getPriorityCount = (prio) => {
    return tasks.filter(t => t.priority === prio && !t.completed).length;
  };

  const handleCategoryClick = (cat) => {
    setActiveFilter(cat);
    setActivePriorityFilter('all'); // Clear priority filter when changing category
  };

  const handlePriorityClick = (prio) => {
    setActivePriorityFilter(prio);
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">TF</div>
        <span className="brand-name">TaskFlow</span>
      </div>

      <nav className="nav-section">
        <h3 className="nav-title">Categories</h3>
        <ul className="nav-menu">
          {categories.map(cat => {
            const isActive = activeFilter === cat && activePriorityFilter === 'all';
            const count = getCount(cat);
            return (
              <li 
                key={cat} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="nav-item-left">
                  {cat !== 'all' && <span className={`category-dot dot-${cat}`} />}
                  <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                </div>
                {count > 0 && <span className="nav-badge">{count}</span>}
              </li>
            );
          })}
        </ul>
      </nav>

      <nav className="nav-section">
        <h3 className="nav-title">Priority Filters</h3>
        <ul className="nav-menu">
          {['all', 'high', 'medium', 'low'].map(prio => {
            const isActive = activePriorityFilter === prio;
            const count = prio === 'all' ? 0 : getPriorityCount(prio);
            return (
              <li 
                key={prio} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handlePriorityClick(prio)}
              >
                <div className="nav-item-left">
                  <span>{prio === 'all' ? 'Show All Priorities' : `● ${prio.toUpperCase()}`}</span>
                </div>
                {prio !== 'all' && count > 0 && <span className="nav-badge">{count}</span>}
              </li>
            );
          })}
        </ul>
      </nav>

      <button type="button" className="theme-toggle-btn" onClick={onToggleTheme}>
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </aside>
  );
};

export default Sidebar;
