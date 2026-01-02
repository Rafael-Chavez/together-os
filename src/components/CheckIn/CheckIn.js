import React, { useState, useEffect } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { startOfWeek, format } from 'date-fns';
import './CheckIn.css';

export default function CheckIn() {
  const { userProfile } = useAuth();
  const [myCheckIn, setMyCheckIn] = useState(null);
  const [partnerCheckIn, setPartnerCheckIn] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  useEffect(() => {
    fetchCheckIns();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('checkins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'check_ins',
          filter: `household_id=eq.${HOUSEHOLD_ID}`,
        },
        () => {
          fetchCheckIns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchCheckIns() {
    const { data, error } = await supabase
      .from('check_ins')
      .select(`
        *,
        user:user_id(id, display_name)
      `)
      .eq('household_id', HOUSEHOLD_ID)
      .eq('week_start_date', weekStart);

    if (error) {
      console.error('Error fetching check-ins:', error);
    } else {
      const mine = data?.find((c) => c.user_id === userProfile.id);
      const partner = data?.find((c) => c.user_id !== userProfile.id);

      setMyCheckIn(mine);
      setPartnerCheckIn(partner);
      setContent(mine?.content || '');
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    if (myCheckIn) {
      // Update existing check-in
      const { error } = await supabase
        .from('check_ins')
        .update({ content })
        .eq('id', myCheckIn.id);

      if (error) {
        console.error('Error updating check-in:', error);
        alert('Failed to update check-in');
      }
    } else {
      // Create new check-in
      const checkInData = {
        household_id: HOUSEHOLD_ID,
        user_id: userProfile.id,
        week_start_date: weekStart,
        content,
      };

      const { error } = await supabase.from('check_ins').insert(checkInData);

      if (error) {
        console.error('Error creating check-in:', error);
        alert('Failed to create check-in');
      }
    }

    setSubmitting(false);
  }

  if (loading) {
    return <div className="loading">Loading check-ins...</div>;
  }

  return (
    <div className="checkin">
      <div className="section-header">
        <h2>Weekly Check-In</h2>
        <span className="week-label text-secondary text-small">
          Week of {format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')}
        </span>
      </div>

      <p className="section-description text-secondary">
        A space to reflect, share what's on your mind, and stay connected.
      </p>

      <form onSubmit={handleSubmit} className="card checkin-form">
        <div className="form-group">
          <label htmlFor="content">Your check-in</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How are you feeling this week? What's on your mind? Anything you want to share or discuss?"
            rows={8}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : myCheckIn ? 'Update Check-In' : 'Submit Check-In'}
          </button>
        </div>
      </form>

      {partnerCheckIn && (
        <div className="partner-checkin card">
          <h3 className="partner-name">
            {partnerCheckIn.user?.display_name}'s check-in
          </h3>
          <p className="partner-content">{partnerCheckIn.content}</p>
          <p className="partner-time text-tertiary text-small">
            {format(new Date(partnerCheckIn.updated_at), 'MMM d, h:mm a')}
          </p>
        </div>
      )}

      {!partnerCheckIn && myCheckIn && (
        <div className="empty-state">
          <p className="text-secondary">
            Your partner hasn't checked in yet this week.
          </p>
        </div>
      )}
    </div>
  );
}
