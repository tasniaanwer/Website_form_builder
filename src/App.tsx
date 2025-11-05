import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppContent from './AppContent';
import { isAuthenticated, getUser } from './utils/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: {
    id: string;
    name: string;
    website?: string;
    logo?: string;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    try {
      if (isAuthenticated()) {
        const userData = getUser();
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
    // Immediate redirect - no additional loading states
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <AppContent
        user={user}
        onLogout={handleLogout}
        onAuthSuccess={handleAuthSuccess}
      />
    </Router>
  );
}

export default App;