
const StatsView = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Active high priority tasks count
  const activeHigh = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  // Active overdue tasks count
  const activeOverdue = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  return (
    <div className="stats-grid">
      <div className="stat-card info">
        <span className="stat-label">Completion Rate</span>
        <span className="stat-value">{completionRate}%</span>
        <span className="stat-footer">
          {completed} of {total} tasks completed
        </span>
      </div>

      <div className="stat-card success">
        <span className="stat-label">Active Tasks</span>
        <span className="stat-value">{active}</span>
        <span className="stat-footer">Tasks currently in progress</span>
      </div>

      <div className="stat-card warning">
        <span className="stat-label">Critical Issues</span>
        <span className="stat-value">{activeHigh}</span>
        <span className="stat-footer">Pending high-priority tasks</span>
      </div>

      <div className="stat-card danger">
        <span className="stat-label">Overdue Tasks</span>
        <span className="stat-value">{activeOverdue}</span>
        <span className="stat-footer" style={{ color: activeOverdue > 0 ? 'var(--danger)' : 'inherit' }}>
          {activeOverdue > 0 ? 'Action required immediately' : 'All deadlines are on track'}
        </span>
      </div>
    </div>
  );
};

export default StatsView;
