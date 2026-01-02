import React, { useState, useEffect } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import NoteForm from './NoteForm';
import NoteItem from './NoteItem';
import './Notes.css';

export default function Notes() {
  const { userProfile } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `household_id=eq.${HOUSEHOLD_ID}`,
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        created_by_user:created_by(id, display_name),
        last_edited_by_user:last_edited_by(id, display_name)
      `)
      .eq('household_id', HOUSEHOLD_ID)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  }

  async function handleDeleteNote(noteId) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
    }
  }

  function handleEditNote(note) {
    setEditingNote(note);
    setShowForm(true);
  }

  function handleCancelEdit() {
    setEditingNote(null);
    setShowForm(false);
  }

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="notes">
      <div className="section-header">
        <h2>Shared Notes</h2>
        <button
          onClick={() => {
            setEditingNote(null);
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Note'}
        </button>
      </div>

      <p className="section-description text-secondary">
        Keep agreements, lists, or anything you both need to reference.
      </p>

      {showForm && (
        <NoteForm
          note={editingNote}
          onSuccess={handleCancelEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="notes-list">
        {notes.length === 0 && !showForm && (
          <p className="empty-state">
            No notes yet. Create one to get started.
          </p>
        )}

        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        ))}
      </div>
    </div>
  );
}
