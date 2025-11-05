import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './WhiteLabelForm.css';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    logo?: string;
    companyName?: string;
  };
}

const WhiteLabelForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchForm = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/${formId}`);
      if (response.ok) {
        const form = await response.json();
        setForm(form);
      } else {
        setForm(null);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      setForm(null);
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId, fetchForm]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form) return false;

    form.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }

      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          responses: formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const error = await response.json();
        console.error('Error submitting form:', error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <div key={field.id} className="form-field">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="form-field">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <textarea
              className={`form-input ${error ? 'error' : ''}`}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
              rows={4}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="form-field">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <select
              className={`form-input ${error ? 'error' : ''}`}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="form-field">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <div className="radio-group">
              {field.options?.map((option, index) => (
                <label key={index} className="radio-label">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                  <span className="radio-text">{option}</span>
                </label>
              ))}
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="form-field">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <div className="checkbox-group">
              {field.options?.map((option, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = value || [];
                      if (e.target.checked) {
                        handleInputChange(field.id, [...currentValues, option]);
                      } else {
                        handleInputChange(field.id, currentValues.filter((v: string) => v !== option));
                      }
                    }}
                  />
                  <span className="checkbox-text">{option}</span>
                </label>
              ))}
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="form-field">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <input
              type="file"
              className={`form-input ${error ? 'error' : ''}`}
              onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
              required={field.required}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      default:
        return null;
    }
  };

  const getThemeStyles = () => {
    if (!form?.theme) return {};

    return {
      '--primary-color': form.theme.primaryColor || '#6366f1',
      '--background-color': form.theme.backgroundColor || '#ffffff',
      '--text-color': form.theme.textColor || '#374151',
      '--border-color': form.theme.primaryColor ? `${form.theme.primaryColor}20` : '#e5e7eb',
    } as React.CSSProperties;
  };

  if (loading || !formId) {
    return (
      <div className="white-label-form-container">
        <div className="loading">Loading form...</div>
      </div>
    );
  }

  if (!form) {
    // Show a demo form for testing when form doesn't exist
    const demoForm: FormData = {
      id: formId || 'demo-form',
      title: 'Demo Contact Form',
      description: 'This is a demo form to show white-label functionality. Please create a form through the form builder to use this feature.',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          required: true,
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message here...',
          required: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'demo-user',
      theme: {
        primaryColor: '#6366f1',
        backgroundColor: '#ffffff',
        textColor: '#374151',
        companyName: 'Demo Company',
      },
    };

    const getThemeStyles = () => {
      return {
        '--primary-color': demoForm.theme?.primaryColor || '#6366f1',
        '--background-color': demoForm.theme?.backgroundColor || '#ffffff',
        '--text-color': demoForm.theme?.textColor || '#374151',
        '--border-color': demoForm.theme?.primaryColor ? `${demoForm.theme.primaryColor}20` : '#e5e7eb',
      } as React.CSSProperties;
    };

    return (
      <div className="white-label-form-container" style={getThemeStyles()}>
        <div className="form-wrapper">
          <div className="form-header">
            {demoForm.theme?.logo && (
              <img src={demoForm.theme.logo} alt="Company Logo" className="form-logo" />
            )}
            {demoForm.theme?.companyName && (
              <h3 className="form-company-name">{demoForm.theme.companyName}</h3>
            )}
          </div>

          <div className="form-content">
            <h1 className="form-title">{demoForm.title}</h1>
            <p className="form-description">{demoForm.description}</p>

            <div className="demo-notice" style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '12px',
              margin: '20px 0',
              color: '#92400e',
              fontSize: '0.9rem',
            }}>
              <strong>⚠️ Demo Mode:</strong> This is a demonstration form. To create your own branded forms, please sign up and use the form builder.
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('This is a demo form. Please create an account and build your own form to use this feature!');
            }} className="white-label-form">
              {demoForm.fields.map(renderField)}

              <button
                type="submit"
                className="submit-button"
                style={{
                  backgroundColor: `var(--primary-color)`,
                }}
              >
                Submit Demo Form
              </button>
            </form>
          </div>

          {(demoForm.theme?.companyName || demoForm.theme?.logo) && (
            <div className="form-footer">
              {demoForm.theme?.companyName && (
                <p>© 2024 {demoForm.theme.companyName}. All rights reserved.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="white-label-form-container" style={getThemeStyles()}>
        <div className="form-wrapper">
          <div className="form-header">
            {form.theme?.logo && (
              <img src={form.theme.logo} alt="Company Logo" className="form-logo" />
            )}
            {form.theme?.companyName && (
              <h3 className="form-company-name">{form.theme.companyName}</h3>
            )}
          </div>
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Thank You!</h2>
            <p>Your form has been submitted successfully.</p>
            {form.theme?.companyName && (
              <p className="company-signature">
                - {form.theme.companyName} Team
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="white-label-form-container" style={getThemeStyles()}>
      <div className="form-wrapper">
        <div className="form-header">
          {form.theme?.logo && (
            <img src={form.theme.logo} alt="Company Logo" className="form-logo" />
          )}
          {form.theme?.companyName && (
            <h3 className="form-company-name">{form.theme.companyName}</h3>
          )}
        </div>

        <div className="form-content">
          <h1 className="form-title">{form.title}</h1>
          {form.description && (
            <p className="form-description">{form.description}</p>
          )}

          <form onSubmit={handleSubmit} className="white-label-form">
            {form.fields.map(renderField)}

            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
              style={{
                backgroundColor: `var(--primary-color)`,
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        {(form.theme?.companyName || form.theme?.logo) && (
          <div className="form-footer">
            {form.theme?.companyName && (
              <p>© 2024 {form.theme.companyName}. All rights reserved.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteLabelForm;