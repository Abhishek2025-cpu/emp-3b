// QRScannerModal.js
import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScannerModal = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Prevents duplicate scanner instances
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
    }

    const handleScanSuccess = (decodedText, decodedResult) => {
      onScanSuccess(decodedText); // Pass result to parent
      handleClose(); // Close modal after successful scan
    };

    const handleScanFailure = (error) => {
      // This is called frequently, so keep it minimal or ignore.
      // console.warn(`QR scan error: ${error}`);
    };

    scannerRef.current.render(handleScanSuccess, handleScanFailure);

    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(error => console.error("Cleanup failed", error));
    }
    onClose();
  };
  
  return (
    <div className="qrModalOverlay" onClick={handleClose}>
      <div className="qrModalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Scan QR Code</h3>
        <div id="qr-reader"></div>
        <button onClick={handleClose}>Cancel</button>
      </div>
    </div>
  );
};

export default QRScannerModal;