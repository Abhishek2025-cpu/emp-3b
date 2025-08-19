import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";

const Manager = () => {
  const [employee, setEmployee] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    const storedEmployee = localStorage.getItem("employee");
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data?.text || data); 
      setShowScanner(false); // close scanner after scan
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

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

        <div style={{ ...styles.card, background: "#B698F7", color: "#fff" }}>
          <h3>📦 Inventory</h3>
          <p>20 Items</p>
        </div>
        <div style={{ ...styles.card, background: "#5A3AA1", color: "#fff" }}>
          <h3>📑 Reports</h3>
          <p>8 Pending</p>
        </div>
      </div>

      {/* Full Screen QR Scanner */}
      {showScanner && (
        <div style={styles.fullScreenScanner}>
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setScanResult(result?.text);
                setShowScanner(false);
              }
              if (!!error) {
                console.error(error);
              }
            }}
            constraints={{ facingMode: "environment" }} // use back camera
            style={{ width: "100%", height: "100%" }}
          />
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
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  },

  // Fullscreen scanner
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
