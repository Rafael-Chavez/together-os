import React, { useState, useEffect } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import ObligationForm from './ObligationForm';
import ObligationItem from './ObligationItem';
import './Obligations.css';

export default function Obligations() {
  const { userProfile } = useAuth();
  const [obligations, setObligations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObligations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('obligations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'obligations',
          filter: `household_id=eq.${HOUSEHOLD_ID}`,
        },
        () => {
          fetchObligations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchObligations() {
    const { data, error } = await supabase
      .from('obligations')
      .select(`
        *,
        paid_by_user:paid_by(id, display_name)
      `)
      .eq('household_id', HOUSEHOLD_ID)
      .order('due_day', { ascending: true });

    if (error) {
      console.error('Error fetching obligations:', error);
    } else {
      setObligations(data || []);
    }
    setLoading(false);
  }

  async function handleTogglePaid(obligation) {
    const isPaid = !obligation.is_paid;

    const { error } = await supabase
      .from('obligations')
      .update({
        is_paid: isPaid,
        paid_at: isPaid ? new Date().toISOString() : null,
        paid_by: isPaid ? userProfile.id : null,
      })
      .eq('id', obligation.id);

    if (error) {
      console.error('Error updating obligation:', error);
    }
  }

  async function handleDeleteObligation(obligationId) {
    const { error } = await supabase
      .from('obligations')
      .delete()
      .eq('id', obligationId);

    if (error) {
      console.error('Error deleting obligation:', error);
    }
  }

  const unpaidObligations = obligations.filter((o) => !o.is_paid);
  const paidObligations = obligations.filter((o) => o.is_paid);

  if (loading) {
    return <div className="loading">Loading obligations...</div>;
  }

  return (
    <div className="obligations">
      <div className="section-header">
        <h2>Obligations</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Obligation'}
        </button>
      </div>

      <p className="section-description text-secondary">
        Track rent, utilities, and other recurring household expenses.
      </p>

      {showForm && (
        <ObligationForm onSuccess={() => setShowForm(false)} />
      )}

      <div className="obligations-list">
        {unpaidObligations.length === 0 && !showForm && (
          <p className="empty-state">
            No obligations yet. Add one to track household expenses.
          </p>
        )}

        {unpaidObligations.map((obligation) => (
          <ObligationItem
            key={obligation.id}
            obligation={obligation}
            onTogglePaid={handleTogglePaid}
            onDelete={handleDeleteObligation}
          />
        ))}
      </div>

      {paidObligations.length > 0 && (
        <div className="completed-section">
          <h3 className="text-secondary">Paid this month</h3>
          {paidObligations.map((obligation) => (
            <ObligationItem
              key={obligation.id}
              obligation={obligation}
              onTogglePaid={handleTogglePaid}
              onDelete={handleDeleteObligation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
