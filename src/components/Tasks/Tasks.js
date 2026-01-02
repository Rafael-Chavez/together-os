import React, { useState, useEffect } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import './Tasks.css';

export default function Tasks() {
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [householdUsers, setHouseholdUsers] = useState([]);

  // Fetch household users
  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('household_id', HOUSEHOLD_ID);
      setHouseholdUsers(data || []);
    }
    fetchUsers();
  }, []);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `household_id=eq.${HOUSEHOLD_ID}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_user:assigned_to(id, display_name),
        created_by_user:created_by(id, display_name),
        completed_by_user:completed_by(id, display_name)
      `)
      .eq('household_id', HOUSEHOLD_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }

  async function handleToggleComplete(task) {
    const isComplete = !task.is_complete;

    const { error } = await supabase
      .from('tasks')
      .update({
        is_complete: isComplete,
        completed_at: isComplete ? new Date().toISOString() : null,
        completed_by: isComplete ? userProfile.id : null,
      })
      .eq('id', task.id);

    if (error) {
      console.error('Error updating task:', error);
    }
  }

  async function handleDeleteTask(taskId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
    }
  }

  const activeTasks = tasks.filter((t) => !t.is_complete);
  const completedTasks = tasks.filter((t) => t.is_complete);

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="tasks">
      <div className="section-header">
        <h2>Tasks & Chores</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm
          householdUsers={householdUsers}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <div className="tasks-list">
        {activeTasks.length === 0 && !showForm && (
          <p className="empty-state">
            No active tasks. Add one to get started.
          </p>
        )}

        {activeTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            householdUsers={householdUsers}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="completed-section">
          <h3 className="text-secondary">Completed</h3>
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              householdUsers={householdUsers}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
