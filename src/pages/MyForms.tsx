import React, { useState, useEffect } from 'react';
import './MyForms.css';

interface Form {
  id: string;
  title: string;
  description: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  responses?: number;
}

interface MyFormsProps {
  onCreateForm?: () => void;
  onEditForm?: (formId: string) => void;
}

const MyForms: React.FC<MyFormsProps> = ({ onCreateForm, onEditForm }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'responses'>('date');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/forms', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }

      const formsData = await response.json();
      setForms(formsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!window.confirm('Are you sure you want to delete this form?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      setForms(forms.filter(form => form.id !== formId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete form');
    }
  };

  const handleDuplicateForm = async (form: Form) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `${form.title} (Copy)`,
          description: form.description,
          fields: form.fields,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate form');
      }

      const newForm = await response.json();
      setForms([newForm, ...forms]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to duplicate form');
    }
  };

  const getFormShareLink = (formId: string) => {
    return `${window.location.origin}/form/${formId}`;
  };

  const handleCopyLink = async (formId: string) => {
    const link = getFormShareLink(formId);
    try {
      await navigator.clipboard.writeText(link);
      alert('Form link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const filteredAndSortedForms = forms
    .filter(form =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'responses':
          return (b.responses || 0) - (a.responses || 0);
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="my-forms-container">
        <div className="loading">Loading your forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-forms-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchForms}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-forms-container">
      <div className="my-forms-header">
        <div className="header-content">
          <h1>My Forms</h1>
          <p className="header-description">
            Manage and organize all your forms in one place
          </p>
        </div>
        <button className="btn btn-primary create-form-btn" onClick={onCreateForm}>
          + Create New Form
        </button>
      </div>

      <div className="forms-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'responses')}
            className="sort-select"
          >
            <option value="date">Last Modified</option>
            <option value="title">Title</option>
            <option value="responses">Response Count</option>
          </select>
        </div>
      </div>

      {filteredAndSortedForms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No forms found</h2>
          <p>
            {searchTerm
              ? 'No forms match your search criteria. Try adjusting your search.'
              : 'Get started by creating your first form.'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={onCreateForm}>
              Create Your First Form
            </button>
          )}
        </div>
      ) : (
        <div className="forms-grid">
          {filteredAndSortedForms.map((form) => (
            <div key={form.id} className="form-card">
              <div className="form-card-header">
                <h3 className="form-title">{form.title}</h3>
                <div className="form-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleCopyLink(form.id)}
                    title="Copy form link"
                  >
                    📋
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDuplicateForm(form)}
                    title="Duplicate form"
                  >
                    📄
                  </button>
                  <button
                    className="btn-icon edit-btn"
                    onClick={() => onEditForm?.(form.id)}
                    title="Edit form"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete-btn"
                    onClick={() => handleDeleteForm(form.id)}
                    title="Delete form"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p className="form-description">
                {form.description || 'No description provided'}
              </p>

              <div className="form-stats">
                <div className="stat">
                  <span className="stat-icon">📝</span>
                  <span className="stat-value">{form.fields?.length || 0} fields</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">📊</span>
                  <span className="stat-value">{form.responses || 0} responses</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">👁️</span>
                  <span className="stat-value">{form.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>

              <div className="form-meta">
                <div className="form-date">
                  Last modified: {new Date(form.updatedAt).toLocaleDateString()}
                </div>
                <div className="form-status">
                  {form.isPublic ? (
                    <span className="status-badge public">Public</span>
                  ) : (
                    <span className="status-badge private">Private</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyForms;