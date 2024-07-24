// src/UserRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 
import Home from './Home';   
import Navbar from './Navbar';   
import AllProducts from './AllProducts';
import About from './About';  
import ConfirmOrder from './ConfirmOrder'; 
import ProductDesc from './ProductDesc';  
import Footer from './Footer.jsx';// Import ConfirmOrder component
import './styles.css'; 

const UserRoutes = () => {
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    navigate('/confirmOrder', { state: { product } });
  };

  return (     
    <> 
      <Navbar />  
      <div className="content-container">
        <Routes> 
          <Route path="*" element={<Home />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/AllProducts" element={<AllProducts onBuyNow={handleBuyNow} />} />
          <Route path="/confirmOrder" element={<ConfirmOrder />} /> {/* Add this route */} 
          <Route path="/ProductDesc" element={<ProductDesc/>} /> 
          <Route path="*" element={<Navigate to="/" />} />  
        </Routes> 
        <Footer/>
      </div> 
    </> 
  );
};

export default UserRoutes;
