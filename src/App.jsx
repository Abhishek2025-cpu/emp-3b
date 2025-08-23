import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './components/LoginPage.jsx'
import Manager from './components/Manager.jsx';
import Operator from './components/Operator.jsx';
import Helper from './components/HelperDashboard.jsx';
import Mixture from './components/Mixture.jsx';
import InventoryInfo from './components/InventoryInfo.jsx';
import AddInventory from './components/AddInventory.jsx';
import AddShipment from './components/AddShipment.jsx';


function App() {
  const [count, setCount] = useState(0)


  return (
    <>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/manager" element={<Manager />} />
      <Route path="/operator" element={<Operator />} />
      <Route path="/helper" element={<Helper />} />
      <Route path="/mixture" element={<Mixture />} />
      <Route path="/inventory-info" element={<InventoryInfo />} />
      <Route path="/assign-inventory" element={<AddInventory />} />
      <Route path="/assign-shipment" element={<AddShipment />} />

       
      </Routes>
    </BrowserRouter>
    

    </>
  )
}

export default App
