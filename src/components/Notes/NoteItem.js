import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function NoteItem({ note, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const lastEditor = note.last_edited_by_user || note.created_by_user;

  return (
    <div className="note-item">
      <div className="note-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="note-edit"
            aria-label="Edit note"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this note?')) {
                onDelete(note.id);
              }
            }}
            className="note-delete"
            aria-label="Delete note"
          >
            ×
          </button>
        </div>
      </div>

      {expanded && note.content && (
        <div className="note-content">
          <p className="note-text">{note.content}</p>
        </div>
      )}

      <div className="note-meta">
        <span className="note-author">
          {lastEditor?.display_name}
        </span>
        <span className="note-time">
          {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
