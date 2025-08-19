import React from "react";

const Operator = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Operator Dashboard</h1>
      <p>Monitor and operate assigned machines efficiently.</p>
      <ul style={styles.list}>
        <li>Machine A - Running</li>
        <li>Machine B - Maintenance</li>
      </ul>
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  title: { color: "#7853C2", textAlign: "center" },
  list: { marginTop: "10px", lineHeight: "1.8" },
};

export default Operator;
