import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import FormBuilder from './pages/FormBuilder';
import MyForms from './pages/MyForms';
import Templates from './pages/Templates';
import WhiteLabelForm from './components/WhiteLabelForm';
import Auth from './components/Auth';

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

interface AppContentProps {
  user: User | null;
  onLogout: () => void;
  onAuthSuccess: (userData: User, token: string) => void;
}

const AppContent: React.FC<AppContentProps> = ({ user, onLogout, onAuthSuccess }) => {
  const navigate = useNavigate();

  const handleNavigateToBuilder = () => {
    navigate('/builder');
  };

  const handleNavigateToHome = () => {
    navigate('/');
  };

  const handleNavigateToMyForms = () => {
    navigate('/forms');
  };

  const handleNavigateToTemplates = () => {
    navigate('/templates');
  };

  const handleCreateForm = () => {
    navigate('/builder');
  };

  const handleEditForm = (formId: string) => {
    navigate(`/builder?formId=${formId}`);
  };

  const handleSelectTemplate = (template: any) => {
    navigate(`/builder?template=${template.id}`);
  };

  if (!user) {
    return <Auth onAuthSuccess={onAuthSuccess} />;
  }

  return (
    <div className="App">
      <Routes>
        {/* White-label form view - no navigation */}
        <Route path="/form/:formId" element={<WhiteLabelForm />} />

        {/* Protected routes with navigation */}
        <Route
          path="/*"
          element={
            <>
              <Navigation
                user={user}
                onLogout={onLogout}
                onNavigateToBuilder={handleNavigateToBuilder}
                onNavigateToHome={handleNavigateToHome}
                onNavigateToMyForms={handleNavigateToMyForms}
                onNavigateToTemplates={handleNavigateToTemplates}
              />
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onNavigateToBuilder={handleNavigateToBuilder} />}
                />
                <Route
                  path="/forms"
                  element={
                    <MyForms
                      onCreateForm={handleCreateForm}
                      onEditForm={handleEditForm}
                    />
                  }
                />
                <Route
                  path="/templates"
                  element={
                    <Templates
                      onSelectTemplate={handleSelectTemplate}
                      onCreateForm={handleCreateForm}
                    />
                  }
                />
                <Route
                  path="/builder"
                  element={<FormBuilder />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default AppContent;