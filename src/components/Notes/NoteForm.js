import React, { useState, useEffect } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function NoteForm({ note, onSuccess, onCancel }) {
  const { userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
    }
  }, [note]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    if (note) {
      // Update existing note
      const { error } = await supabase
        .from('notes')
        .update({
          title,
          content: content || null,
          last_edited_by: userProfile.id,
        })
        .eq('id', note.id);

      if (error) {
        console.error('Error updating note:', error);
        alert('Failed to update note');
      } else {
        onSuccess();
      }
    } else {
      // Create new note
      const noteData = {
        household_id: HOUSEHOLD_ID,
        title,
        content: content || null,
        created_by: userProfile.id,
      };

      const { error } = await supabase.from('notes').insert(noteData);

      if (error) {
        console.error('Error creating note:', error);
        alert('Failed to create note');
      } else {
        setTitle('');
        setContent('');
        onSuccess();
      }
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card note-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's this note about?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write anything you need to remember..."
          rows={6}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
        </button>
        {note && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
