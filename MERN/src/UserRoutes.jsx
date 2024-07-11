// src/UserRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';  
import Navbar from './Navbar';
import About from './About';

const UserRoutes = () => {
  return (     
   <>
    <Navbar/> 
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="*" element={<Navigate to="/" />} />  
    </Routes>  
    </> 
  );
};

export default UserRoutes;
