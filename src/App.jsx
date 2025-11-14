import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Reminders from './pages/Reminders';
import { authService } from './services/authService';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    })();

    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading MediX...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="app">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={() => setUser(null)}
      />

      <main className="app-main">
        {currentPage === 'dashboard' && <Dashboard userId={user.id} />}
        {currentPage === 'upload' && (
          <Upload userId={user.id} onUploadSuccess={() => setCurrentPage('dashboard')} />
        )}
        {currentPage === 'reminders' && <Reminders userId={user.id} />}
      </main>
    </div>
  );
}
