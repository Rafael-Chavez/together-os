import React, { useState } from 'react';

export default function ObligationItem({ obligation, onTogglePaid, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  const categoryEmoji = {
    rent: '🏠',
    utilities: '💡',
    internet: '🌐',
    other: '📋',
  };

  return (
    <div className={`obligation-item ${obligation.is_paid ? 'paid' : ''}`}>
      <div className="obligation-main">
        <input
          type="checkbox"
          checked={obligation.is_paid}
          onChange={() => onTogglePaid(obligation)}
          className="obligation-checkbox"
        />
        <div
          className="obligation-content"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="obligation-header">
            <span className="obligation-emoji">
              {categoryEmoji[obligation.category]}
            </span>
            <span className="obligation-title">{obligation.title}</span>
          </div>
          <div className="obligation-meta">
            {obligation.amount && (
              <span className="obligation-amount">
                ${obligation.amount.toFixed(2)}
              </span>
            )}
            <span className="obligation-due">Due on day {obligation.due_day}</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Delete this obligation?')) {
              onDelete(obligation.id);
            }
          }}
          className="obligation-delete"
          aria-label="Delete obligation"
        >
          ×
        </button>
      </div>

      {showDetails && obligation.notes && (
        <div className="obligation-details">
          <p>{obligation.notes}</p>
        </div>
      )}
    </div>
  );
}
