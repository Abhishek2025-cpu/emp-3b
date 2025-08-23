// src/components/InventoryInfo.jsx
// This file does not need to be changed.

import React from 'react';
import './InventoryInfo.css'; // Just make sure it's importing the new CSS
import { FaCogs, FaShippingFast, FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';

const InventoryInfo = ({ onClose }) => {
    const navigate = useNavigate();
  return (
    <div className="inventoryOverlay">
      <header className="inventoryHeader">
        <h2>Inventory Management</h2>
        <button className="inventoryCloseBtn" onClick={onClose}>
          &times;
        </button>
      </header>
      <main className="inventoryContent" 
    >
       
        <div className="infoGrid">
          <div className="infoCard
          " onClick={() => navigate('/assign-inventory')}>
            <FaCogs className="icon" />
            <h4>Assign Machines</h4>
          </div>
          <div className="infoCard"
          onClick={() => navigate('/assign-shipment')}>
            <FaShippingFast className="icon" />
            <h4>Assign Shipments</h4>
          </div>
          <div className="infoCard">
            <FaBoxOpen className="icon" />
            <h4>Inventory Products</h4>
          </div>
          <div className="infoCard">
            <FaClipboardList className="icon" />
            <h4>Orders</h4>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryInfo;