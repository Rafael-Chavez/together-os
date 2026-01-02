import React, { useState } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';

export default function ObligationForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('1');
  const [category, setCategory] = useState('other');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const obligationData = {
      household_id: HOUSEHOLD_ID,
      title,
      amount: amount ? parseFloat(amount) : null,
      due_day: parseInt(dueDay),
      category,
      notes: notes || null,
    };

    const { error } = await supabase.from('obligations').insert(obligationData);

    if (error) {
      console.error('Error creating obligation:', error);
      alert('Failed to create obligation');
    } else {
      setTitle('');
      setAmount('');
      setDueDay('1');
      setCategory('other');
      setNotes('');
      onSuccess();
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card obligation-form">
      <div className="form-group">
        <label htmlFor="title">What is it?</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Rent, Electric bill"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount (optional)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDay">Due day of month</label>
          <select
            id="dueDay"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="rent">Rent</option>
          <option value="utilities">Utilities</option>
          <option value="internet">Internet</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Payment details, account info, etc."
          rows={2}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Obligation'}
        </button>
      </div>
    </form>
  );
}
