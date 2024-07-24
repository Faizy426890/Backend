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
        {/* Admin routes are accessible under /Login/* */}
        <Route path="/Login/*" element={<AdminRoutes />} />
        
        {/* Standalone route for ConfirmDelivery */}
        <Route path="/confirmOrder" element={<ConfirmDelivery />} />

        {/* User routes catch-all */}
        <Route path="*" element={<UserRoutes />} /> 
      </Routes>
    </Router>
  );
};

export default App;
