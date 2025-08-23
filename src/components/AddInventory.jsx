// src/components/AddInventory.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaArrowLeft, FaCogs, FaUserCog, FaUser, FaUserTag, FaUsers,
  FaBoxes, FaBoxOpen, FaCalendarAlt, FaToggleOn, FaBox, FaPlusCircle, FaSpinner
} from 'react-icons/fa';
import styles from './AddInventory.module.css';

const AddInventory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'Operator',
    mixtureName: '',
    operatorName: '',
    helperName: '',
    machineNo: '',
    modelNo: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    shift: true, // true for Night, false for Day
    packingEntry: '',
  });

  const [staff, setStaff] = useState({ operators: [], helpers: [], mixtures: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMixtureRole = formData.role === 'Mixture';

  // --- Animation Variants ---
  const formGroupVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };
  
  // --- API Fetching Logic ---
  useEffect(() => {
    const fetchStaff = async (role, setter) => {
      try {
        const response = await fetch(`https://b2b-1ccx.onrender.com/api/get-staffs/${role}`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setter(data.data);
        } else {
          setter([]);
          toast.error(`Could not fetch ${role}s.`);
        }
      } catch (error) {
        toast.error(`Error fetching ${role}s.`);
        console.error(`Error fetching ${role}s:`, error);
      }
    };

    const fetchAllStaff = async () => {
      setIsLoading(true);
      if (isMixtureRole) {
        await fetchStaff('Mixture', (data) => setStaff(s => ({ ...s, mixtures: data })));
      } else {
        await Promise.all([
          fetchStaff('Operator', (data) => setStaff(s => ({ ...s, operators: data }))),
          fetchStaff('Helper', (data) => setStaff(s => ({ ...s, helpers: data }))),
        ]);
      }
      setIsLoading(false);
    };

    fetchAllStaff();
  }, [formData.role]);


  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submissionData = {
      role: formData.role,
      mixtureName: isMixtureRole ? formData.mixtureName : null,
      operatorName: isMixtureRole ? null : formData.operatorName,
      helperName: isMixtureRole ? null : formData.helperName,
      machineNo: formData.machineNo,
      modelNo: isMixtureRole ? null : formData.modelNo,
      date: formData.date,
      shift: formData.shift ? 'Night' : 'Day',
      packingEntry: isMixtureRole ? null : formData.packingEntry,
      assignedBy: localStorage.getItem('managerName') || 'Unknown Manager',
    };
    
    const submissionPromise = fetch('https://b2b-1ccx.onrender.com/api/assign-machine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
    }).then(res => res.json().then(data => {
        if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed');
        return data.message || 'Machine assigned successfully!';
    }));

    toast.promise(submissionPromise, {
        loading: 'Assigning machine...',
        success: (message) => {
            // Optional: reset form or navigate away
            // navigate('/dashboard'); 
            return message;
        },
        error: (err) => err.toString(),
    });

    try {
        await submissionPromise;
    } catch (error) {
        // Error toast is already handled by toast.promise
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- Dynamic Dropdown Options ---
  const machineNumbers = Array.from({ length: isMixtureRole ? 3 : 9 }, (_, i) => i + 1);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div 
        className={styles.pageContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Go Back
        </button>

        <motion.div className={styles.formSection} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
          <h3 className={styles.formHeader}><FaCogs /> Assign Machine</h3>
          <form onSubmit={handleSubmit}>
            
            <motion.div className={styles.formGroup} variants={formGroupVariant} initial="hidden" animate="visible">
              <label className={styles.formLabel}><FaUserCog /> Role Type</label>
              <select className={styles.formSelect} name="role" value={formData.role} onChange={handleChange} required>
                <option value="Operator">Operator</option>
                <option value="Mixture">Mixture</option>
              </select>
              {isLoading && <FaSpinner className={styles.loader} />}
            </motion.div>

            <AnimatePresence mode="wait">
              {isMixtureRole ? (
                <motion.div key="mixture" className={styles.formGroup} variants={formGroupVariant} initial="hidden" animate="visible" exit="exit">
                  <label className={styles.formLabel}><FaUser /> Mixture Name</label>
                  <select className={styles.formSelect} name="mixtureName" value={formData.mixtureName} onChange={handleChange} required>
                    <option value="">Select mixture</option>
                    {staff.mixtures.map(s => <option key={s._id} value={s.fullName}>{s.fullName}</option>)}
                  </select>
                </motion.div>
              ) : (
                <motion.div key="operator-helper">
                  <motion.div className={styles.formGroup} variants={formGroupVariant} initial="hidden" animate="visible" exit="exit">
                    <label className={styles.formLabel}><FaUserTag /> Operator Name</label>
                    <select className={styles.formSelect} name="operatorName" value={formData.operatorName} onChange={handleChange} required>
                      <option value="">Select operator</option>
                      {staff.operators.map(s => <option key={s._id} value={s.fullName}>{s.fullName}</option>)}
                    </select>
                  </motion.div>
                  <motion.div className={styles.formGroup} variants={formGroupVariant} initial="hidden" animate="visible" exit="exit">
                    <label className={styles.formLabel}><FaUsers /> Helper Name</label>
                    <select className={styles.formSelect} name="helperName" value={formData.helperName} onChange={handleChange} required>
                      <option value="">Select helper</option>
                      {staff.helpers.map(s => <option key={s._id} value={s.fullName}>{s.fullName}</option>)}
                    </select>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- Common Fields --- */}
            <motion.div className={styles.formGroup} variants={formGroupVariant} initial="hidden" animate="visible">
              <label className={styles.formLabel}><FaBoxes /> Machine No</label>
              <select className={styles.formSelect} name="machineNo" value={formData.machineNo} onChange={handleChange} required>
                <option value="">Select machine number</option>
                {machineNumbers.map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </motion.div>

            <AnimatePresence>
            {!isMixtureRole && (
              <motion.div key="model-packing" initial="hidden" animate="visible" exit="exit" variants={{visible: { transition: { staggerChildren: 0.1 }}}}>
                 <motion.div className={styles.formGroup} variants={formGroupVariant}>
                    <label className={styles.formLabel}><FaBoxOpen /> Model No</label>
                    <input type="text" className={styles.formControl} placeholder="Enter model number" name="modelNo" value={formData.modelNo} onChange={handleChange} required={!isMixtureRole} />
                </motion.div>
                <motion.div className={styles.formGroup} variants={formGroupVariant}>
                    <label className={styles.formLabel}><FaBox /> Packing Entry</label>
                    <input type="text" className={styles.formControl} placeholder="e.g. 80-90-100" name="packingEntry" value={formData.packingEntry} onChange={handleChange} required={!isMixtureRole} />
                </motion.div>
              </motion.div>
            )}
            </AnimatePresence>

            <motion.div className={styles.formGroup} variants={formGroupVariant} initial="hidden" animate="visible">
              <label className={styles.formLabel}><FaCalendarAlt /> Date</label>
              <input type="date" className={styles.formControl} name="date" value={formData.date} onChange={handleChange} required />
            </motion.div>

            <motion.div className={`${styles.formGroup} ${styles.toggleSwitch}`} variants={formGroupVariant} initial="hidden" animate="visible">
              <label className={styles.formLabel}><FaToggleOn /> Shift: <strong>{formData.shift ? 'Night' : 'Day'}</strong></label>
              <label className={styles.switch}>
                <input type="checkbox" name="shift" checked={formData.shift} onChange={handleChange} />
                <span className={styles.slider}></span>
              </label>
            </motion.div>

            <motion.button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? <FaSpinner className={styles.loader} style={{position: 'static', animation: 'spin 1s linear infinite'}} /> : <><FaPlusCircle /> Assign Machine</>}
            </motion.button>

          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AddInventory;