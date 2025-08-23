// HelperDashboard.js
import React, { useEffect, useState } from "react";
import "./HelperDashboard.css"; // Import the new CSS file
import QRScannerModal from "./QRScannerModal";
import TrackOrders from "./TrackOrders"; // Assuming TrackOrders is in the same folder

// --- SVG Icons for Action Cards ---
const QRIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11V9a2 2 0 0 1 2-2h2"/><path d="M21 11V9a2 2 0 0 0-2-2h-2"/><path d="M3 13v2a2 2 0 0 0 2 2h2"/><path d="M21 13v2a2 2 0 0 1-2 2h-2"/><path d="M9 9h6v6H9z"/><path d="M9 18h6"/></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l4-4-4-4"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>;


const HelperDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [showTrackOrders, setShowTrackOrders] = useState(false);

  useEffect(() => {
    const storedEmployee = localStorage.getItem("employee");
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  const handleScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    setShowScanner(false); // Close scanner on success
  };

  if (!employee) {
    return <p>Loading Helper Dashboard...</p>; // Or a proper loader component
  }
  
  if (showTrackOrders) {
      return <TrackOrders onClose={() => setShowTrackOrders(false)} />;
  }

  return (
    <div className="helperDashboard">
      {/* Conditionally render the scanner modal */}
      {showScanner && (
        <QRScannerModal
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Header */}
      <header className="dashboardHeader">
        <img src={employee.adharImageUrl || 'https://via.placeholder.com/150'} alt="Profile" className="avatar" />
        <div className="headerInfo">
          <h2>Welcome, {employee.name}</h2>
          <p className="role">{employee.role}</p>
          <p className="eid">ID: {employee.eid}</p>
        </div>
      </header>

      {/* Scan Result Display */}
      {scanResult && (
        <div className="scanResultContainer">
          <strong>Scan Successful:</strong> {scanResult}
        </div>
      )}

      {/* Action Grid */}
      <main className="dashboardGrid">
        <div className="actionCard" onClick={() => setShowScanner(true)}>
          <QRIcon />
          <h3>Box Loading</h3>
          <p>Scan QR codes to log box movements.</p>
        </div>

        <div className="actionCard" onClick={() => setShowTrackOrders(true)}>
          <TruckIcon />
          <h3>Track Shipment</h3>
          <p>View the real-time status of shipments.</p>
        </div>
      </main>
    </div>
  );
};

export default HelperDashboard;