import React, { useState } from 'react';

interface NavigationProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    company?: any;
  };
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) {
    // Public navigation for non-authenticated users
    return (
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>FormCraft</h2>
          </div>
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#home" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="#features" className="nav-link">Features</a>
            </li>
            <li className="nav-item">
              <a href="#templates" className="nav-link">Templates</a>
            </li>
            <li className="nav-item">
              <a href="#pricing" className="nav-link">Pricing</a>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary">Get Started</button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  // Authenticated navigation
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>FormCraft</h2>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="#dashboard" className="nav-link">Dashboard</a>
          </li>
          <li className="nav-item">
            <a href="#forms" className="nav-link">My Forms</a>
          </li>
          <li className="nav-item">
            <a href="#templates" className="nav-link">Templates</a>
          </li>
          {user.company && (
            <li className="nav-item">
              <a href="#team" className="nav-link">Team</a>
            </li>
          )}
          <li className="nav-item user-menu">
            <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  {user.company && (
                    <div className="user-company">{user.company.name}</div>
                  )}
                </div>
                <div className="dropdown-divider"></div>
                <a href="#profile" className="dropdown-item">Profile</a>
                <a href="#settings" className="dropdown-item">Settings</a>
                {user.role === 'company_admin' && (
                  <a href="#company" className="dropdown-item">Company Settings</a>
                )}
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;