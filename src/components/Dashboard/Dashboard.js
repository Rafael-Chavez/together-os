import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tasks from '../Tasks/Tasks';
import Obligations from '../Obligations/Obligations';
import Notes from '../Notes/Notes';
import CheckIn from '../CheckIn/CheckIn';
import './Dashboard.css';

export default function Dashboard() {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');

  const tabs = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'obligations', label: 'Obligations' },
    { id: 'notes', label: 'Notes' },
    { id: 'checkin', label: 'Check-in' },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Together</h1>
          <div className="header-actions">
            <span className="user-name">{userProfile?.display_name}</span>
            <button onClick={signOut} className="btn-secondary btn-small">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-main container">
        {activeTab === 'tasks' && <Tasks />}
        {activeTab === 'obligations' && <Obligations />}
        {activeTab === 'notes' && <Notes />}
        {activeTab === 'checkin' && <CheckIn />}
      </main>
    </div>
  );
}
