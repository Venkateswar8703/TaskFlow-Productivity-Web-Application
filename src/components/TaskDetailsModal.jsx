
const TaskDetailsModal = ({ task, onToggleSubtask, onDelete, onEdit, onClose }) => {
  if (!task) return null;

  const { id, title, description, category, priority, dueDate, completed, subtasks = [] } = task;

  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(sub => sub.completed).length;

  const isOverdue = () => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <span className={`task-category-tag tag-${category}`} style={{ fontSize: '0.8rem' }}>
            {category}
          </span>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 className="modal-title" style={{ fontSize: '1.75rem', lineHeight: '1.2', textDecoration: completed ? 'line-through' : 'none', color: completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              {title}
            </h2>
          </div>

          <div className="detail-meta-row">
            <div className="meta-item">
              <span className="meta-label">Priority</span>
              <span className={`meta-value priority-${priority}`} style={{ textTransform: 'capitalize' }}>
                ● {priority}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Due Date</span>
              <span className={`meta-value ${isOverdue() ? 'overdue' : ''}`}>
                {formatDate(dueDate)} {isOverdue() && '⚠️ (Overdue)'}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span className="meta-value" style={{ color: completed ? 'var(--success)' : 'var(--primary)' }}>
                {completed ? '✓ Completed' : '⚙️ In Progress'}
              </span>
            </div>
          </div>

          {description ? (
            <div className="form-group">
              <span className="form-label" style={{ fontSize: '0.8rem' }}>Description</span>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {description}
              </p>
            </div>
          ) : (
            <div className="form-group">
              <span className="form-label" style={{ fontSize: '0.8rem' }}>Description</span>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No description provided.
              </p>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className="form-group">
              <span className="form-label" style={{ fontSize: '0.8rem' }}>
                Checklist ({completedSubtasks} of {totalSubtasks} completed)
              </span>
              <div className="detail-checklist">
                {subtasks.map(sub => (
                  <div 
                    key={sub.id} 
                    className={`checklist-item ${sub.completed ? 'checked' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onToggleSubtask(id, sub.id)}
                  >
                    <div className="checkbox-container">
                      <div className={`checkbox-custom ${sub.completed ? 'checkbox-active' : ''}`} style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
                    </div>
                    <span className="checklist-text">{sub.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => { onEdit(task); onClose(); }}
              style={{ marginRight: 'auto' }}
            >
              ✏️ Edit Task
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => { onDelete(id); onClose(); }}
              style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
            >
              🗑️ Delete
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
