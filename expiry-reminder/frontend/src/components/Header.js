import React from 'react';
import './Header.css';

function Header({ onAddClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Expiry Date Reminder</h1>
        <button className="add-button" onClick={onAddClick}>
          Add New Reminder
        </button>
      </div>
    </header>
  );
}

export default Header; 