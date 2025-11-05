import React, { useState } from 'react';
import './Templates.css';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: any[];
  preview: string;
  isPopular?: boolean;
  isPremium?: boolean;
}

interface TemplatesProps {
  onSelectTemplate?: (template: Template) => void;
  onCreateForm?: () => void;
}

const Templates: React.FC<TemplatesProps> = ({ onSelectTemplate, onCreateForm }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'contact', name: 'Contact Forms' },
    { id: 'survey', name: 'Surveys' },
    { id: 'registration', name: 'Registration' },
    { id: 'feedback', name: 'Feedback' },
    { id: 'application', name: 'Applications' },
    { id: 'order', name: 'Order Forms' },
    { id: 'event', name: 'Event Planning' },
  ];

  const templates: Template[] = [
    {
      id: 'contact-basic',
      name: 'Basic Contact Form',
      description: 'Simple contact form with name, email, and message fields',
      category: 'contact',
      preview: '📝',
      isPopular: true,
      fields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: false },
        { id: 'message', type: 'textarea', label: 'Message', required: true },
      ]
    },
    {
      id: 'customer-feedback',
      name: 'Customer Feedback',
      description: 'Collect feedback from your customers with rating scales and comments',
      category: 'feedback',
      preview: '⭐',
      isPopular: true,
      fields: [
        { id: 'satisfaction', type: 'radio', label: 'Overall Satisfaction', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
        { id: 'recommend', type: 'radio', label: 'Would you recommend us?', required: true, options: ['Yes', 'No', 'Maybe'] },
        { id: 'improvements', type: 'textarea', label: 'What can we improve?', required: false },
        { id: 'email', type: 'email', label: 'Email (optional)', required: false },
      ]
    },
    {
      id: 'event-registration',
      name: 'Event Registration',
      description: 'Complete event registration form with attendee details',
      category: 'registration',
      preview: '🎫',
      fields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: true },
        { id: 'organization', type: 'text', label: 'Organization', required: false },
        { id: 'dietary', type: 'checkbox', label: 'Dietary Restrictions', required: false, options: ['Vegetarian', 'Vegan', 'Gluten-Free', 'None'] },
      ]
    },
    {
      id: 'job-application',
      name: 'Job Application',
      description: 'Comprehensive job application form with resume upload',
      category: 'application',
      preview: '💼',
      isPremium: true,
      fields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: true },
        { id: 'position', type: 'select', label: 'Position Applied For', required: true, options: ['Software Engineer', 'Designer', 'Marketing', 'Sales', 'Other'] },
        { id: 'experience', type: 'textarea', label: 'Relevant Experience', required: true },
        { id: 'resume', type: 'file', label: 'Upload Resume', required: true },
      ]
    },
    {
      id: 'survey-csat',
      name: 'Customer Satisfaction Survey',
      description: 'Measure customer satisfaction with detailed questions',
      category: 'survey',
      preview: '📊',
      fields: [
        { id: 'product-quality', type: 'radio', label: 'Product Quality', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        { id: 'customer-service', type: 'radio', label: 'Customer Service', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        { id: 'likelihood-purchase', type: 'radio', label: 'Likelihood to Purchase Again', required: true, options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely'] },
        { id: 'comments', type: 'textarea', label: 'Additional Comments', required: false },
      ]
    },
    {
      id: 'order-form',
      name: 'Product Order Form',
      description: 'Simple order form with product selection and shipping details',
      category: 'order',
      preview: '🛒',
      fields: [
        { id: 'customer-name', type: 'text', label: 'Customer Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: true },
        { id: 'product', type: 'select', label: 'Product', required: true, options: ['Basic Plan - $9/month', 'Pro Plan - $19/month', 'Enterprise Plan - $49/month'] },
        { id: 'quantity', type: 'number', label: 'Quantity', required: true },
        { id: 'address', type: 'textarea', label: 'Shipping Address', required: true },
      ]
    },
    {
      id: 'contact-support',
      name: 'Support Request',
      description: 'Technical support form for customer issues',
      category: 'contact',
      preview: '🛠️',
      fields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'issue-type', type: 'select', label: 'Issue Type', required: true, options: ['Technical Problem', 'Billing Question', 'Feature Request', 'Account Issue', 'Other'] },
        { id: 'priority', type: 'radio', label: 'Priority Level', required: true, options: ['Low', 'Medium', 'High', 'Urgent'] },
        { id: 'description', type: 'textarea', label: 'Issue Description', required: true },
      ]
    },
    {
      id: 'newsletter-signup',
      name: 'Newsletter Signup',
      description: 'Simple newsletter subscription form',
      category: 'contact',
      preview: '📧',
      fields: [
        { id: 'name', type: 'text', label: 'First Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'interests', type: 'checkbox', label: 'Topics of Interest', required: false, options: ['Technology', 'Business', 'Design', 'Marketing', 'News'] },
      ]
    },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handleStartFromScratch = () => {
    if (onCreateForm) {
      onCreateForm();
    }
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <div className="header-content">
          <h1>Form Templates</h1>
          <p className="header-description">
            Choose from our professionally designed templates or start from scratch
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleStartFromScratch}>
          + Start from Scratch
        </button>
      </div>

      <div className="templates-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="templates-grid">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-preview">
              <span className="template-icon">{template.preview}</span>
              {template.isPopular && (
                <span className="template-badge popular">Popular</span>
              )}
              {template.isPremium && (
                <span className="template-badge premium">Premium</span>
              )}
            </div>

            <div className="template-content">
              <h3 className="template-name">{template.name}</h3>
              <p className="template-description">{template.description}</p>

              <div className="template-meta">
                <span className="template-category">
                  {categories.find(cat => cat.id === template.category)?.name}
                </span>
                <span className="template-fields">
                  {template.fields.length} fields
                </span>
              </div>

              <div className="template-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleSelectTemplate(template)}
                >
                  Use Template
                </button>
                <button className="btn btn-text btn-sm">
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Start from Scratch Card */}
        <div className="template-card scratch-card">
          <div className="template-preview">
            <span className="template-icon">✨</span>
          </div>
          <div className="template-content">
            <h3 className="template-name">Start from Scratch</h3>
            <p className="template-description">
              Create a completely custom form with our drag-and-drop builder
            </p>
            <div className="template-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleStartFromScratch}
              >
                Create Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="no-results">
          <h3>No templates found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};

export default Templates;