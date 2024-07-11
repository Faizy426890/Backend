// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import Home from './Home';
import Login from './Login'; 
import AdminPanel from './AdminsPanel';
import AddProducts from './AddProducts'; 
import ConfirmDelivery from './ConfirmOrder';
import CheckOrders from './CheckOrders'; 
import PlacedOrder from './PlacedOrder'; 
import About from './About';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Login/AdminPanel/*" element={<AdminPanel />}>
          <Route path="AddProducts" element={<AddProducts />} /> 
          <Route path="CheckOrders" element={<CheckOrders />} /> 
          <Route path="PlacedOrder" element={<PlacedOrder/>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} /> 
        <Route path="/confirmOrder" element={<ConfirmDelivery />} />  
        <Route path="/About" element={<About />} />  
      </Routes>
    </Router>
  );
};

export default App;
