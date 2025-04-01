import React from 'react';
import './Header.css';

function Header({ onAddClick, onScanQRClick }) {
  return (
    <header className="app-header">
      <h1>Expiry Reminder</h1>
      <div className="header-actions">
        <button className="scan-qr-button" onClick={onScanQRClick}>
          Scan QR
        </button>
        <button className="add-button" onClick={onAddClick}>
          Add Reminder
        </button>
      </div>
    </header>
  );
}

export default Header; 