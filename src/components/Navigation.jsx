import React from 'react';
import { LogOut } from 'lucide-react';
import { authService } from '../services/authService';
import './Navigation.css';

export default function Navigation({ currentPage, onPageChange, onLogout }) {
  const handleLogout = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-brand">MediX</h1>

        <div className="nav-links">
          <button
            onClick={() => onPageChange('dashboard')}
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onPageChange('upload')}
            className={`nav-btn ${currentPage === 'upload' ? 'active' : ''}`}
          >
            Upload
          </button>
          <button
            onClick={() => onPageChange('reminders')}
            className={`nav-btn ${currentPage === 'reminders' ? 'active' : ''}`}
          >
            Reminders
          </button>
        </div>

        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
