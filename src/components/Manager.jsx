import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import TrackOrders from "./TrackOrders";
import { useNavigate } from "react-router-dom";

const Manager = () => {
  const [employee, setEmployee] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const scannerRef = useRef(null);
  const [showTrackOrders, setShowTrackOrders] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const storedEmployee = localStorage.getItem("employee");
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  useEffect(() => {
    if (showScanner) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText);
          setShowScanner(false);
          scannerRef.current.clear();
        },
        (error) => {
          console.warn("QR Scan error:", error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [showScanner]);

  if (!employee) return <p>Loading Manager Dashboard...</p>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <img src={employee.adharImageUrl} alt="Profile" style={styles.avatar} />
        <div>
          <h2 style={styles.welcome}>Welcome, {employee.name}</h2>
          <p style={styles.role}>Role: {employee.role}</p>
          <p style={styles.eid}>Employee ID: {employee.eid}</p>
        </div>
      </header>

      {/* Overview Grid */}
      <div style={styles.grid}>
        <div style={{ ...styles.card, background: "#7853C2", color: "#fff" }}>
          <h3>👥 Staff</h3>
          <p>12 Active Staff</p>
        </div>

        {/* Track Boxes */}
        <div
          style={{
            ...styles.card,
            background: "#9A75E5",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => setShowScanner(true)}
        >
          <h3>📦 Track Boxes</h3>
          <p>Tap to Scan</p>
        </div>

        <div style={{ ...styles.card, background: "#B698F7", color: "#fff" }}
        onClick={() => navigate("/inventory-info")}>
        
        
          <h3>📦 Inventory</h3>
          <p>20 Items</p>
        </div>
        <div style={{ ...styles.card, background: "#5A3AA1", color: "#fff" }}>
          <h3>📑 Reports</h3>
          <p>8 Pending</p>
        </div>
      </div>

       <div style={{ ...styles.card, background: "#6C47B6", color: "#fff" }}
         onClick={() => setShowTrackOrders(true)}>
          <h3>🚚 Track Orders</h3>
          <p>5 Orders In Transit</p>
        </div>

      {/* Full Screen QR Scanner */}
      {showScanner && (
        <div style={styles.fullScreenScanner}>
          <div id="qr-reader" style={{ width: "100%", maxWidth: "500px" }}></div>
          <button
            style={styles.closeScannerBtn}
            onClick={() => setShowScanner(false)}
          >
            ✖ Close
          </button>
        </div>
      )}

      {/* Show Scan Result */}
      {scanResult && (
        <div style={styles.scanResult}>
          <h4>✅ Scan Result:</h4>
          <p>{scanResult}</p>
        </div>
      )}
       {showTrackOrders && (
        <TrackOrders onClose={() => setShowTrackOrders(false)} />
      )}

    </div>
  );
};

const styles = {
  container: { padding: "20px" },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#7853C2",
    color: "white",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid white",
  },
  welcome: { margin: 0, fontSize: "1.2rem", fontWeight: "600" },
  role: { margin: "4px 0 0 0", fontSize: "0.9rem" },
  eid: { margin: "2px 0 0 0", fontSize: "0.8rem", opacity: 0.8 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    borderRadius: "12px",
    padding: "18px",
    marginTop: "10px",
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  },

  fullScreenScanner: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#000",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  closeScannerBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "red",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  scanResult: {
    marginTop: "20px",
    padding: "15px",
    background: "#EDE7F6",
    borderRadius: "8px",
    border: "1px solid #d1c4e9",
  },
};

export default Manager;
