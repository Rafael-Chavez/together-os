import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function TaskItem({ task, householdUsers, onToggleComplete, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  const assignedUser = householdUsers.find((u) => u.id === task.assigned_to);

  return (
    <div className={`task-item ${task.is_complete ? 'completed' : ''}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.is_complete}
          onChange={() => onToggleComplete(task)}
          className="task-checkbox"
        />
        <div className="task-content" onClick={() => setShowDetails(!showDetails)}>
          <div className="task-title">{task.title}</div>
          <div className="task-meta">
            {assignedUser && (
              <span className="task-assigned">
                {assignedUser.display_name}
              </span>
            )}
            {task.is_recurring && (
              <span className="task-recurring">
                ↻ {task.recurrence_pattern}
              </span>
            )}
            <span className="task-time">
              {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Delete this task?')) {
              onDelete(task.id);
            }
          }}
          className="task-delete"
          aria-label="Delete task"
        >
          ×
        </button>
      </div>

      {showDetails && task.description && (
        <div className="task-details">
          <p>{task.description}</p>
        </div>
      )}
    </div>
  );
}
