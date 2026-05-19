import { useState } from 'react';

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [title, setTitle] = useState(task ? task.title || '' : '');
  const [description, setDescription] = useState(task ? task.description || '' : '');
  const [category, setCategory] = useState(task ? task.category || 'work' : 'work');
  const [priority, setPriority] = useState(task ? task.priority || 'medium' : 'medium');
  const [dueDate, setDueDate] = useState(task ? task.dueDate || '' : '');
  const [subtasks, setSubtasks] = useState(task ? task.subtasks || [] : []);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [error, setError] = useState('');

  // Categories list matching CSS classes
  const categories = ['work', 'personal', 'shopping', 'health', 'ideas'];
  const priorities = ['low', 'medium', 'high'];

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    
    const newSubtask = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      text: newSubtaskText.trim(),
      completed: false
    };

    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (idToRemove) => {
    setSubtasks(subtasks.filter(sub => sub.id !== idToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task Title is required');
      return;
    }

    const taskData = {
      id: task ? task.id : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      subtasks,
      completed: task ? task.completed : false,
      createdAt: task ? task.createdAt : new Date().toISOString()
    };

    onSubmit(taskData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div className="alert-banner" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', backgroundColor: 'var(--danger-light)' }}>⚠️ {error}</div>}

          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Design Landing Page" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea" 
              placeholder="Provide some details about this task..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {priorities.map(prio => (
                  <option key={prio} value={prio}>
                    {prio.charAt(0).toUpperCase() + prio.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Subtask Builder */}
          <div className="form-group">
            <label className="form-label">Subtasks Checklist</label>
            
            {subtasks.length > 0 && (
              <div className="subtask-builder-list">
                {subtasks.map((sub) => (
                  <div key={sub.id} className="subtask-builder-item">
                    <span className="subtask-builder-text">{sub.text}</span>
                    <button 
                      type="button" 
                      className="action-btn delete" 
                      onClick={() => handleRemoveSubtask(sub.id)}
                      style={{ height: '22px', width: '22px', fontSize: '0.75rem' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="subtask-input-row">
              <input 
                type="text" 
                className="form-input" 
                placeholder="Add checklist item..." 
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddSubtask(e); } }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddSubtask}>
                Add
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
