// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes'; 
import ConfirmDelivery from './ConfirmOrder';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login/*" element={<AdminRoutes />} />
        <Route path="*" element={<UserRoutes />} /> 
    <Route path="/confirmOrder" element={<ConfirmDelivery />} />
      </Routes>
    </Router>
  );
};

export default App;
