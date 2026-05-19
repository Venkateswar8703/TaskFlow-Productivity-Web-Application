
const TaskCard = ({ task, onToggleComplete, onDelete, onEdit, onView }) => {
  const { id, title, description, category, priority, dueDate, completed, subtasks = [] } = task;

  // Calculate subtasks completion
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(sub => sub.completed).length;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Check if task is overdue
  const isOverdue = () => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle clicking on card (except for buttons or checkbox)
  const handleCardClick = (e) => {
    // If the click is on an interactive element, do not trigger general view/edit
    if (e.target.closest('.action-btn') || e.target.closest('.checkbox-container')) {
      return;
    }
    onView(task);
  };

  return (
    <div className={`task-card ${completed ? 'completed' : ''}`} onClick={handleCardClick}>
      <div className="task-header">
        <span className={`task-category-tag tag-${category}`}>
          {category}
        </span>
        
        <div className="task-actions">
          <button 
            type="button" 
            className="action-btn" 
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            title="Edit Task"
          >
            ✏️
          </button>
          <button 
            type="button" 
            className="action-btn delete" 
            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '0.25rem' }}>
        <div className="checkbox-container" onClick={(e) => { e.stopPropagation(); onToggleComplete(id); }}>
          <div className={`checkbox-custom ${completed ? 'checkbox-active' : ''}`} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <h3 className="task-title">{title}</h3>
          {description && <p className="task-desc">{description}</p>}
        </div>
      </div>

      {totalSubtasks > 0 && (
        <div className="subtasks-section" onClick={(e) => e.stopPropagation()}>
          <div className="subtasks-header">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks} ({subtasksPercent}%)</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${subtasksPercent}%` }} />
          </div>
        </div>
      )}

      <div className="task-footer">
        {dueDate ? (
          <div className={`task-date ${isOverdue() ? 'overdue' : ''}`}>
            📅 {isOverdue() ? 'Overdue: ' : ''}{formatDate(dueDate)}
          </div>
        ) : (
          <div className="task-date">No due date</div>
        )}
        
        <div className={`task-priority-badge priority-${priority}`}>
          ● {priority}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
