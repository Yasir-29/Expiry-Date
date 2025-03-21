import React, { useState } from 'react';
import './ReminderItem.css';
import ReminderForm from './ReminderForm';

function ReminderItem({ reminder, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(reminder.expiryDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityClass = () => {
    switch (reminder.priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getExpiryStatus = () => {
    const daysUntil = getDaysUntilExpiry();
    if (daysUntil < 0) return 'expired';
    if (daysUntil <= 3) return 'critical';
    if (daysUntil <= 7) return 'warning';
    return 'safe';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <ReminderForm
        initialData={reminder}
        onSubmit={(data) => {
          onUpdate(reminder._id, data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className={`reminder-item ${getPriorityClass()} ${getExpiryStatus()}`}>
      <div className="reminder-content">
        <div className="reminder-header">
          <h3>{reminder.title}</h3>
          <div className="reminder-badges">
            <span className="category-badge">{reminder.category}</span>
            <span className="priority-badge">{reminder.priority}</span>
          </div>
        </div>
        
        {reminder.description && (
          <p className="reminder-description">{reminder.description}</p>
        )}
        
        <div className="reminder-details">
          <span className="expiry-date">
            Expires: {formatDate(reminder.expiryDate)}
          </span>
          <span className={`days-until ${getExpiryStatus()}`}>
            {getDaysUntilExpiry() < 0
              ? `Expired ${Math.abs(getDaysUntilExpiry())} days ago`
              : `${getDaysUntilExpiry()} days remaining`}
          </span>
        </div>
      </div>

      <div className="reminder-actions">
        <button 
          className="edit-button" 
          onClick={() => setIsEditing(true)}
          title="Edit reminder"
        >
          Edit
        </button>
        <button 
          className="delete-button" 
          onClick={() => onDelete(reminder._id)}
          title="Delete reminder"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ReminderItem; 