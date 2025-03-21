import React, { useState } from 'react';
import ReminderItem from './ReminderItem';
import './ReminderList.css';

function ReminderList({ reminders, onUpdate, onDelete }) {
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all',
    sortBy: 'expiryDate'
  });

  const filterReminders = () => {
    return reminders
      .filter(reminder => {
        if (filter.category === 'all') return true;
        return reminder.category === filter.category;
      })
      .filter(reminder => {
        const today = new Date();
        const expiryDate = new Date(reminder.expiryDate);
        const isExpired = expiryDate < today;

        switch (filter.status) {
          case 'active':
            return !isExpired;
          case 'expired':
            return isExpired;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        switch (filter.sortBy) {
          case 'expiryDate':
            return new Date(a.expiryDate) - new Date(b.expiryDate);
          case 'priority':
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case 'category':
            return a.category.localeCompare(b.category);
          default:
            return 0;
        }
      });
  };

  const filteredReminders = filterReminders();

  return (
    <div className="reminder-list">
      <div className="list-controls">
        <div className="filter-group">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            <option value="Food">Food</option>
            <option value="Medicine">Medicine</option>
            <option value="Document">Document</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
          >
            <option value="expiryDate">Sort by Expiry Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {filteredReminders.length === 0 ? (
        <div className="no-reminders">
          <p>No reminders found</p>
        </div>
      ) : (
        <div className="reminders-grid">
          {filteredReminders.map(reminder => (
            <ReminderItem
              key={reminder._id}
              reminder={reminder}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReminderList; 