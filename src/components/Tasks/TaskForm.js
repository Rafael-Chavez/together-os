import React, { useState } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TaskForm({ householdUsers, onSuccess }) {
  const { userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('weekly');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const taskData = {
      household_id: HOUSEHOLD_ID,
      title,
      description: description || null,
      assigned_to: assignedTo || null,
      created_by: userProfile.id,
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : null,
      next_due_date: isRecurring ? new Date().toISOString().split('T')[0] : null,
    };

    const { error } = await supabase.from('tasks').insert(taskData);

    if (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } else {
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setIsRecurring(false);
      onSuccess();
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card task-form">
      <div className="form-group">
        <label htmlFor="title">Task</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Details (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any additional context..."
          rows={2}
        />
      </div>

      <div className="form-group">
        <label htmlFor="assignedTo">Assign to (optional)</label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Anyone</option>
          {householdUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.display_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <span>Recurring task</span>
        </label>
      </div>

      {isRecurring && (
        <div className="form-group">
          <label htmlFor="recurrence">Repeats</label>
          <select
            id="recurrence"
            value={recurrencePattern}
            onChange={(e) => setRecurrencePattern(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
