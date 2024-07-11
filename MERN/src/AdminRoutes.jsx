// src/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminPanel from './AdminsPanel';
import AddProducts from './AddProducts';
import CheckOrders from './CheckOrders';
import PlacedOrder from './PlacedOrder';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="AdminPanel/*" element={<AdminPanel />}>
        <Route path="AddProducts" element={<AddProducts />} />
        <Route path="CheckOrders" element={<CheckOrders />} />
        <Route path="PlacedOrder" element={<PlacedOrder />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AdminRoutes;
