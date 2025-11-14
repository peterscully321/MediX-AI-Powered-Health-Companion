import React, { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { reminderService } from '../services/reminderService';
import './Reminders.css';

export default function RemindersPage({ userId }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReminders();
    const interval = setInterval(loadReminders, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadReminders = async () => {
    try {
      const data = await reminderService.getUpcomingReminders(userId, 7);
      setReminders(data || []);
    } catch (err) {
      console.error('Error loading reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReminder = async (reminderId, action) => {
    try {
      await reminderService.updateReminderStatus(reminderId, action === 'taken' ? 'taken' : 'skipped');
      await reminderService.logComplianceEvent(userId, reminderId, action);

      setReminders(reminders.map(r =>
        r.id === reminderId ? { ...r, status: action === 'taken' ? 'taken' : 'skipped' } : r
      ));
    } catch (err) {
      console.error('Error updating reminder:', err);
    }
  };

  const filteredReminders = reminders.filter(r => {
    if (filter === 'pending') return r.status === 'scheduled';
    if (filter === 'completed') return r.status === 'taken';
    if (filter === 'missed') return r.status === 'skipped';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken':
        return 'status-taken';
      case 'skipped':
        return 'status-skipped';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="reminders-loading">Loading reminders...</div>;
  }

  return (
    <div className="reminders-page">
      <h1>Medication Reminders</h1>

      <div className="filter-tabs">
        <button
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('missed')}
          className={`filter-btn ${filter === 'missed' ? 'active' : ''}`}
        >
          Missed
        </button>
      </div>

      {filteredReminders.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h2>No reminders</h2>
          <p>Upload a prescription to create medication reminders.</p>
        </div>
      ) : (
        <div className="reminders-list">
          {filteredReminders.map((reminder) => (
            <div key={reminder.id} className={`reminder-card ${getStatusColor(reminder.status)}`}>
              <div className="reminder-content">
                <div className="reminder-time">
                  {new Date(reminder.scheduled_at).toLocaleString()}
                </div>

                {reminder.medications && (
                  <div className="reminder-med">
                    <h3>{reminder.medications.name}</h3>
                    {reminder.medications.dose && (
                      <p><strong>Dose:</strong> {reminder.medications.dose}</p>
                    )}
                    {reminder.medications.frequency && (
                      <p><strong>Frequency:</strong> {reminder.medications.frequency}</p>
                    )}
                    {reminder.medications.instructions && (
                      <p><strong>Instructions:</strong> {reminder.medications.instructions}</p>
                    )}
                  </div>
                )}

                <div className="reminder-status">
                  <span className={`status-badge ${reminder.status}`}>
                    {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                  </span>
                </div>
              </div>

              {reminder.status === 'scheduled' && (
                <div className="reminder-actions">
                  <button
                    className="action-btn taken"
                    onClick={() => handleCompleteReminder(reminder.id, 'taken')}
                    title="Mark as taken"
                  >
                    <Check size={20} />
                    Taken
                  </button>
                  <button
                    className="action-btn skipped"
                    onClick={() => handleCompleteReminder(reminder.id, 'skipped')}
                    title="Mark as skipped"
                  >
                    <X size={20} />
                    Skip
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
