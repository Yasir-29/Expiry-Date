import React, { useState, useEffect } from 'react';
import { useZxing } from 'react-zxing';
import './QRCodeScanner.css';

const QRCodeScanner = ({ onDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Check if the browser is Safari on iOS
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsSafari(isSafariBrowser && isIOS);
  }, []);

  const {
    ref,
    torch,
    start,
    stop,
    isStarted,
  } = useZxing({
    onDecodeResult(result) {
      setShowSuccess(true);
      onDetected(result.getText());
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    },
    onError(error) {
      if (error.name === 'NotAllowedError') {
        setError('Camera permission denied. Please enable camera access.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera found on your device.');
      } else {
        setError('Error accessing camera: ' + error.message);
      }
    },
  });

  const handleStartScan = async () => {
    setError('');
    try {
      if (isSafari) {
        // For Safari on iOS, we need to request permission explicitly
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      }
      setIsScanning(true);
      start();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Please enable camera access in your browser settings.');
      } else {
        setError('Error starting camera: ' + err.message);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    stop();
  };

  return (
    <div className="qr-scanner-container">
      <h2>Scan QR Code</h2>
      {error && <div className="error-message">{error}</div>}
      
      {!isScanning ? (
        <button className="scan-button" onClick={handleStartScan}>
          Start Scanning
        </button>
      ) : (
        <div className="scanner-view">
          {isSafari && (
            <div className="safari-notice">
              For iOS Safari: Please allow camera access when prompted
            </div>
          )}
          <video
            ref={ref}
            className="scanner-video"
            style={{ display: isScanning ? 'block' : 'none' }}
          />
          <div className="scanner-overlay">
            <div className="scanner-target"></div>
          </div>
          <button className="stop-button" onClick={handleStopScan}>
            Stop Scanning
          </button>
        </div>
      )}
      
      {showSuccess && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          <span className="success-text">QR Code scanned successfully!</span>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner; 