import React from "react";

const Helper = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧑‍🔧 Helper Dashboard</h1>
      <p>View assigned support tasks and update progress.</p>
      <div style={styles.taskBox}>
        <p><strong>Task:</strong> Deliver tools to Operator</p>
        <p>Status: Pending</p>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center" },
  title: { color: "#7853C2" },
  taskBox: {
    background: "#f4f4f4",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "15px",
  },
};

export default Helper;
