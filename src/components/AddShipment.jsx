// src/components/AddShipment.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaTruck, FaPlus, FaUser, FaUserTie, FaBox, FaTimes, FaWeightHanging,
  FaMapMarkerAlt, FaSpinner
} from 'react-icons/fa';
import styles from './AddShipment.module.css';

// --- API Endpoints ---
const API_BASE_URL = "https://threebapi-1067354145699.asia-south1.run.app/api";
const VEHICLES_URL = `${API_BASE_URL}/vehicles/get`;
const STAFF_URL = `${API_BASE_URL}/staff/get-employees`;
const ORDERS_URL = `${API_BASE_URL}/orders/get-orders`;
const CREATE_SHIPMENT_URL = `${API_BASE_URL}/shipments/create`;

// --- Reusable Component for Form Fields ---
const FormField = ({ icon, label, children }) => (
  <div className={styles.formGroup}>
    <label className={styles.formLabel}>{icon} {label}</label>
    {children}
  </div>
);

// --- Main Component ---
const AddShipment = () => {
  // --- State Management ---
  const [shipmentDetails, setShipmentDetails] = useState({
    vehicleId: '',
    driverId: '',
    helperId: '',
    orderId: '',
    quantity: '',
    startPoint: '', // Simplified to a text input
    endPoint: ''    // Simplified to a text input
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: '', vehicleNumber: '' });

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsDataLoading(true);
      const loadingToast = toast.loading("Fetching necessary data...");
      try {
        const [vehiclesRes, staffRes, ordersRes] = await Promise.all([
          fetch(VEHICLES_URL),
          fetch(STAFF_URL),
          fetch(ORDERS_URL)
        ]);

        const vehiclesData = await vehiclesRes.json();
        const staffData = await staffRes.json();
        const ordersData = await ordersRes.json();

        setVehicles(vehiclesData || []);
        
        // **BUG FIX:** The API returns an object with an 'orders' key.
        // We need to access the array inside it: `ordersData.orders`
        setOrders(ordersData.orders || []);
        
        if (Array.isArray(staffData)) {
            setDrivers(staffData.filter(s => s.role === 'Driver'));
            setHelpers(staffData.filter(s => s.role === 'Helper'));
        }
        
        toast.success("Data loaded!", { id: loadingToast });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("Could not load data. Please refresh.", { id: loadingToast });
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- Handlers ---
  const handleShipmentChange = (e) => {
    const { name, value } = e.target;
    setShipmentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.vehicleNumber) return toast.error('All fields are required!');
    // This should eventually be an API call to your backend to add a vehicle
    const newVehicleWithId = { ...newVehicle, _id: `v${Date.now()}` };
    setVehicles(prev => [...prev, newVehicleWithId]);
    toast.success(`Vehicle "${newVehicle.name}" added!`);
    setNewVehicle({ name: '', vehicleNumber: '' });
    setIsVehicleModalOpen(false);
  };

  const handleShipmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Creating shipment...');

    const selectedVehicle = vehicles.find(v => v._id === shipmentDetails.vehicleId);
    if (!selectedVehicle) {
      setIsSubmitting(false);
      return toast.error("Invalid vehicle selected.", { id: toastId });
    }

    const payload = {
      vehicle: selectedVehicle.name,
      vehicleNumber: selectedVehicle.vehicleNumber,
      driverId: shipmentDetails.driverId,
      helperId: shipmentDetails.helperId,
      orderId: shipmentDetails.orderId,
      quantity: Number(shipmentDetails.quantity),
      startPoint: shipmentDetails.startPoint,
      endPoint: shipmentDetails.endPoint
    };

    try {
      const response = await fetch(CREATE_SHIPMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || "Failed to create shipment"); }
      const result = await response.json();
      toast.success(result.message || "Shipment created successfully!", { id: toastId });
      setShipmentDetails({ vehicleId: '', driverId: '', helperId: '', orderId: '', quantity: '', startPoint: '', endPoint: '' });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariant = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } };

  return (
    <>
      <Toaster position="top-center" />
      
      <AnimatePresence>
        {isVehicleModalOpen && (
          <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modalContent} variants={modalVariant} initial="hidden" animate="visible" exit="exit">
              <div className={styles.modalHeader}>
                <h3>Add New Vehicle</h3>
                <button className={styles.modalCloseButton} onClick={() => setIsVehicleModalOpen(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleAddNewVehicle}>
                <input type="text" className={styles.formInput} placeholder="Vehicle Name (e.g., Tata Ace)" value={newVehicle.name} onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })} required />
                <div style={{height: '1rem'}} />
                <input type="text" className={styles.formInput} placeholder="Vehicle Number (e.g., KN-9598)" value={newVehicle.vehicleNumber} onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })} required />
                <button type="submit" className={styles.addButton} style={{ width: '100%', marginTop: '1.5rem' }}> <FaPlus /> Add Vehicle </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h2><FaTruck /> Add Shipment</h2>
          <button className={styles.addButton} onClick={() => setIsVehicleModalOpen(true)}> <FaPlus /> Add Vehicle </button>
        </div>
        
        <form className={styles.formSection} onSubmit={handleShipmentSubmit}>
          {isDataLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <FaSpinner style={{ fontSize: '2rem', color: 'var(--primary-color)' }} className="fa-spin" />
                <p>Loading form data...</p>
            </div>
          ) : (
            <>
              <FormField icon={<FaTruck />} label="Select Vehicle"><select name="vehicleId" value={shipmentDetails.vehicleId} onChange={handleShipmentChange} className={styles.formInput} required><option value="" disabled>Choose a vehicle...</option>{vehicles.map(v => <option key={v._id} value={v._id}>{v.name} - {v.vehicleNumber}</option>)}</select></FormField>
              <FormField icon={<FaUserTie />} label="Select Driver"><select name="driverId" value={shipmentDetails.driverId} onChange={handleShipmentChange} className={styles.formInput} required><option value="" disabled>Choose a driver...</option>{drivers.map(d => <option key={d._id} value={d._id}>{d.fullName}</option>)}</select></FormField>
              <FormField icon={<FaUser />} label="Select Helper"><select name="helperId" value={shipmentDetails.helperId} onChange={handleShipmentChange} className={styles.formInput} required><option value="" disabled>Choose a helper...</option>{helpers.map(h => <option key={h._id} value={h._id}>{h.fullName}</option>)}</select></FormField>
              <FormField icon={<FaBox />} label="Select Product / Order"><select name="orderId" value={shipmentDetails.orderId} onChange={handleShipmentChange} className={styles.formInput} required><option value="" disabled>Choose an order...</option>{orders.map(o => <option key={o._id} value={o._id}>{o.products[0]?.productName || 'Order ' + o.orderId}</option>)}</select></FormField>
              <FormField icon={<FaWeightHanging />} label="Quantity"><input type="number" name="quantity" value={shipmentDetails.quantity} onChange={handleShipmentChange} className={styles.formInput} placeholder="e.g., 50" required /></FormField>
              <FormField icon={<FaMapMarkerAlt />} label="Start Point"><input type="text" name="startPoint" value={shipmentDetails.startPoint} onChange={handleShipmentChange} className={styles.formInput} placeholder="e.g., Warehouse A, Mumbai" required /></FormField>
              <FormField icon={<FaMapMarkerAlt />} label="End Point"><input type="text" name="endPoint" value={shipmentDetails.endPoint} onChange={handleShipmentChange} className={styles.formInput} placeholder="e.g., Site B, Pune" required /></FormField>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting || isDataLoading}>{isSubmitting ? 'Creating...' : 'Create Shipment'}</button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default AddShipment;