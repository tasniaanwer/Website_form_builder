import React, { useState } from 'react';
import './FormBuilder.css';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const FormBuilder: React.FC = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'textarea', label: 'Paragraph', icon: '📄' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'radio', label: 'Multiple Choice', icon: '⭕' },
    { type: 'checkbox', label: 'Checkboxes', icon: '☑️' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'file', label: 'File Upload', icon: '📎' },
  ];

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id));
    if (selectedField === id) {
      setSelectedField(null);
    }
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = formFields.findIndex(field => field.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formFields.length) return;

    const newFields = [...formFields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    setFormFields(newFields);
  };

  const addOption = (fieldId: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field && field.options) {
      updateField(fieldId, {
        options: [...field.options, `Option ${field.options.length + 1}`]
      });
    }
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field && field.options && field.options.length > 1) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex);
      updateField(fieldId, { options: newOptions });
    }
  };

  const selectedFieldData = formFields.find(field => field.id === selectedField);

  return (
    <div className="form-builder">
      <div className="builder-header">
        <div className="form-info">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="form-title-input"
            placeholder="Form Title"
          />
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="form-description-input"
            placeholder="Form Description (optional)"
            rows={2}
          />
        </div>
        <div className="builder-actions">
          <button className="btn btn-outline">Preview</button>
          <button className="btn btn-primary">Save Form</button>
        </div>
      </div>

      <div className="builder-content">
        {/* Field Types Sidebar */}
        <div className="field-types-sidebar">
          <h3>Form Fields</h3>
          <div className="field-types">
            {fieldTypes.map((fieldType) => (
              <div
                key={fieldType.type}
                className="field-type"
                onClick={() => addField(fieldType.type)}
              >
                <span className="field-icon">{fieldType.icon}</span>
                <span className="field-label">{fieldType.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Canvas */}
        <div className="form-canvas">
          <div className="form-preview">
            {formFields.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>Start Building Your Form</h3>
                <p>Drag fields from the sidebar or click to add them to your form</p>
              </div>
            ) : (
              <div className="form-fields">
                {formFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`form-field ${selectedField === field.id ? 'selected' : ''}`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <div className="field-controls">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(field.id, 'up');
                        }}
                        disabled={index === 0}
                        className="field-btn"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(field.id, 'down');
                        }}
                        disabled={index === formFields.length - 1}
                        className="field-btn"
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(field.id);
                        }}
                        className="field-btn delete"
                      >
                        ×
                      </button>
                    </div>
                    <div className="field-content">
                      <label>
                        {field.label}
                        {field.required && <span className="required">*</span>}
                      </label>
                      {renderFieldPreview(field)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Field Properties Panel */}
        <div className="field-properties">
          {selectedFieldData ? (
            <div className="properties-panel">
              <h3>Field Properties</h3>
              <div className="property-group">
                <label>Field Label</label>
                <input
                  type="text"
                  value={selectedFieldData.label}
                  onChange={(e) => updateField(selectedField!, { label: e.target.value })}
                />
              </div>

              <div className="property-group">
                <label>Placeholder Text</label>
                <input
                  type="text"
                  value={selectedFieldData.placeholder || ''}
                  onChange={(e) => updateField(selectedField!, { placeholder: e.target.value })}
                />
              </div>

              <div className="property-group">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFieldData.required}
                    onChange={(e) => updateField(selectedField!, { required: e.target.checked })}
                  />
                  Required Field
                </label>
              </div>

              {selectedFieldData.options && (
                <div className="property-group">
                  <label>Options</label>
                  <div className="options-list">
                    {selectedFieldData.options.map((option, index) => (
                      <div key={index} className="option-item">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(selectedField!, index, e.target.value)}
                        />
                        <button
                          onClick={() => removeOption(selectedField!, index)}
                          className="option-remove"
                          disabled={selectedFieldData.options!.length <= 1}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(selectedField!)}
                      className="btn btn-outline btn-small"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="properties-panel empty">
              <div className="empty-icon">⚙️</div>
              <p>Select a field to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const renderFieldPreview = (field: FormField) => {
  const commonProps = {
    placeholder: field.placeholder,
    required: field.required
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return <input type={field.type} {...commonProps} />;
    case 'textarea':
      return <textarea {...commonProps} rows={3} />;
    case 'select':
      return (
        <select {...commonProps}>
          <option value="">Select an option</option>
          {field.options?.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      );
    case 'radio':
      return (
        <div className="radio-group">
          {field.options?.map((option, index) => (
            <label key={index} className="radio-label">
              <input type="radio" name={field.id} value={option} />
              {option}
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="checkbox-group">
          {field.options?.map((option, index) => (
            <label key={index} className="checkbox-label">
              <input type="checkbox" value={option} />
              {option}
            </label>
          ))}
        </div>
      );
    case 'date':
      return <input type="date" {...commonProps} />;
    case 'file':
      return <input type="file" {...commonProps} />;
    default:
      return <input type="text" {...commonProps} />;
  }
};

export default FormBuilder;