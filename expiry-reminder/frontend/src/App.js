import React, { useState, useEffect } from 'react';
import './App.css';
import ReminderList from './components/ReminderList';
import ReminderForm from './components/ReminderForm';
import QRCodeScanner from './components/QRCodeScanner';
import Header from './components/Header';
import { fetchReminders, createReminder, updateReminder, deleteReminder } from './services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scannedReminderData, setScannedReminderData] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);
  
  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
      setScannedReminderData(null);  // Clear scanned data after submission
      setError(null);
      return newReminder;
    } catch (err) {
      setError('Failed to add reminder');
      console.error('Error adding reminder:', err);
      return null;
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
  
  const handleQRCodeDetected = async (data) => {
    // Close the scanner
    setShowQRScanner(false);
    
    try {
      // Validate scanned data
      if (!data) {
        throw new Error('Empty QR code data');
      }
      
      // Check if data has required fields
      if (!data.title || !data.expiryDate) {
        throw new Error('Invalid reminder data: missing required fields');
      }
      
      // Make sure date is in proper format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.expiryDate)) {
        // Try to fix the date if it's in a different format
        const dateObj = new Date(data.expiryDate);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Invalid date format in QR data');
        }
        
        // Convert to proper format
        data.expiryDate = dateObj.toISOString().split('T')[0];
      }
      
      // Fill in optional fields if missing to prevent errors
      data.description = data.description || '';
      data.category = data.category || 'Other';
      data.priority = data.priority || 'Medium';
      
      // Directly add the reminder to the list instead of showing the form
      setLoading(true);
      const newReminder = await handleAddReminder(data);
      setLoading(false);
      
      if (newReminder) {
        // Show success message
        setSuccess(`Reminder "${data.title}" added successfully!`);
      }
      
    } catch (err) {
      console.error('QR scan error:', err);
      setError(`Invalid QR code data: ${err.message}`);
    }
  };
  
  const handleCancelAddForm = () => {
    setShowAddForm(false);
    setScannedReminderData(null);  // Clear any scanned data
  };

  return (
    <div className="App">
      <Header 
        onAddClick={() => {
          setScannedReminderData(null);  // Clear any previous scanned data
          setShowAddForm(true);
        }} 
        onScanQRClick={() => setShowQRScanner(true)} 
      />
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {success && (
        <div className="success-notification">
          <div className="success-notification-icon">✓</div>
          <div>{success}</div>
          <button onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      <main className="container">
        {showAddForm && (
          <ReminderForm
            initialData={scannedReminderData}
            onSubmit={handleAddReminder}
            onCancel={handleCancelAddForm}
          />
        )}
        
        {showQRScanner && (
          <QRCodeScanner
            onQRCodeDetected={handleQRCodeDetected}
            onClose={() => setShowQRScanner(false)}
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
