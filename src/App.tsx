import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import FormBuilder from './pages/FormBuilder';
import Auth from './components/Auth';
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
  const [currentView, setCurrentView] = useState<'home' | 'builder'>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    if (isAuthenticated()) {
      const userData = getUser();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('home');
  };

  const navigateToBuilder = () => {
    setCurrentView('builder');
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      {user ? (
        <>
          <Navigation
            user={user}
            onLogout={handleLogout}
            onNavigateToBuilder={navigateToBuilder}
            onNavigateToHome={navigateToHome}
            currentView={currentView}
          />
          {currentView === 'home' ? <HomePage onNavigateToBuilder={navigateToBuilder} /> : <FormBuilder />}
        </>
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;