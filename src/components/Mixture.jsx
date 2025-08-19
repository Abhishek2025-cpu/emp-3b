import React from "react";

const Mixture = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧪 Mixture Dashboard</h1>
      <p>Track raw material mixing and production updates.</p>
      <div style={styles.stats}>
        <p>✅ Batch 1 - Completed</p>
        <p>⏳ Batch 2 - In Progress</p>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center" },
  title: { color: "#7853C2" },
  stats: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
};

export default Mixture;
