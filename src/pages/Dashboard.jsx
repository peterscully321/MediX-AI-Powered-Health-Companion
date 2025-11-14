import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { reminderService } from '../services/reminderService';
import { prescriptionService } from '../services/prescriptionService';
import './Dashboard.css';

export default function Dashboard({ userId }) {
  const [stats, setStats] = useState({
    total: 0,
    taken: 0,
    skipped: 0,
    adherenceRate: 0,
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, prescriptionsData] = await Promise.all([
        reminderService.getComplianceStats(userId, 30),
        prescriptionService.getPrescriptions(userId),
      ]);

      setStats(statsData);
      setPrescriptions(prescriptionsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon adherence">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Adherence Rate</p>
            <p className="stat-value">{stats.adherenceRate}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon taken">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Doses Taken</p>
            <p className="stat-value">{stats.taken}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon skipped">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Doses Skipped</p>
            <p className="stat-value">{stats.skipped}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Doses</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="prescriptions-section">
        <h2>Your Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <div className="empty-state">
            <p>No prescriptions yet. Upload your first prescription to get started.</p>
          </div>
        ) : (
          <div className="prescriptions-list">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="prescription-card">
                <div className="prescription-header">
                  <h3>{prescription.original_filename}</h3>
                  <p className="prescription-date">
                    {new Date(prescription.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="medications">
                  <p className="medications-count">
                    {prescription.medications?.length || 0} medications
                  </p>
                  {prescription.medications && prescription.medications.length > 0 && (
                    <ul className="med-list">
                      {prescription.medications.map((med) => (
                        <li key={med.id}>
                          <strong>{med.name}</strong>
                          {med.dose && <span> - {med.dose}</span>}
                          {med.frequency && <span> - {med.frequency}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
