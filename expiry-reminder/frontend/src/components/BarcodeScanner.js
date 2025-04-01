import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import './BarcodeScanner.css';

function BarcodeScanner({ onBarcodeDetected, onClose }) {
  const [error, setError] = useState('');
  
  const { ref } = useZxing({
    onDecodeResult(result) {
      onBarcodeDetected(result.getText());
    },
    onError(error) {
      setError(`Error scanning: ${error.message}`);
    },
  });

  return (
    <div className="barcode-scanner-container">
      <div className="barcode-scanner-header">
        <h3>Scan Barcode</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      
      <div className="video-container">
        <video ref={ref} className="scanner-video" />
        <div className="scanner-overlay">
          <div className="scanner-target"></div>
        </div>
      </div>
      
      <div className="scanner-instructions">
        <p>Position the barcode inside the frame to scan</p>
      </div>
    </div>
  );
}

export default BarcodeScanner; 