import React, { useState, useEffect } from 'react';
import './App.css';
import ReminderList from './components/ReminderList';
import ReminderForm from './components/ReminderForm';
import Header from './components/Header';
import { fetchReminders, createReminder, updateReminder, deleteReminder } from './services/api';

function App() {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await fetchReminders();
      setReminders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reminders');
      console.error('Error loading reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (reminderData) => {
    try {
      const newReminder = await createReminder(reminderData);
      setReminders([...reminders, newReminder]);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add reminder');
      console.error('Error adding reminder:', err);
    }
  };

  const handleUpdateReminder = async (id, updates) => {
    try {
      const updatedReminder = await updateReminder(id, updates);
      setReminders(reminders.map(reminder => 
        reminder._id === id ? updatedReminder : reminder
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update reminder');
      console.error('Error updating reminder:', err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id);
      setReminders(reminders.filter(reminder => reminder._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete reminder');
      console.error('Error deleting reminder:', err);
    }
  };

  return (
    <div className="App">
      <Header onAddClick={() => setShowAddForm(true)} />
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="container">
        {showAddForm && (
          <ReminderForm
            onSubmit={handleAddReminder}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {loading ? (
          <div className="loading">Loading reminders...</div>
        ) : (
          <ReminderList
            reminders={reminders}
            onUpdate={handleUpdateReminder}
            onDelete={handleDeleteReminder}
          />
        )}
      </main>
    </div>
  );
}

export default App;
