import React, { useState } from 'react';
import './ReminderForm.css';
import BarcodeScanner from './BarcodeScanner';
import { fetchProductByBarcode } from '../services/api';

function ReminderForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
    category: initialData?.category || 'Other',
    priority: initialData?.priority || 'Medium',
    barcode: initialData?.barcode || ''
  });
  
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleBarcodeDetected = async (barcode) => {
    try {
      setLoading(true);
      setError('');
      setShowScanner(false);
      
      const result = await fetchProductByBarcode(barcode);
      
      if (result.exists) {
        // A reminder with this barcode already exists
        setError('A reminder for this product already exists');
      } else if (result.product) {
        // Product found, pre-fill the form
        setFormData({
          title: result.product.title,
          description: result.product.description,
          category: result.product.category,
          expiryDate: result.product.suggestedExpiryDate,
          priority: 'Medium',
          barcode: barcode
        });
      } else {
        // No product found for this barcode
        setFormData(prev => ({
          ...prev,
          barcode: barcode
        }));
        setError('No product found for this barcode. Please fill in the details manually.');
      }
    } catch (err) {
      setError('Error fetching product details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reminder-form">
      <h2>{initialData ? 'Edit Reminder' : 'Add New Reminder'}</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading product details...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="barcode-field">
            <div className="form-group">
              <label htmlFor="barcode">Barcode</label>
              <div className="barcode-input-group">
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Enter barcode or scan"
                />
                <button 
                  type="button" 
                  className="scan-button"
                  onClick={() => setShowScanner(true)}
                >
                  Scan
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter reminder title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter reminder description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Food">Food</option>
                <option value="Medicine">Medicine</option>
                <option value="Document">Document</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {initialData ? 'Update' : 'Add'} Reminder
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {showScanner && (
        <BarcodeScanner 
          onBarcodeDetected={handleBarcodeDetected} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </div>
  );
}

export default ReminderForm; 