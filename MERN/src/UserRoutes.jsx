// src/UserRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 
import Home from './Home.jsx';   
import Navbar from './Navbar.jsx';   
import AllProducts from './AllProducts.jsx';
import About from './About.jsx';  
import ConfirmOrder from './ConfirmOrder.jsx'; 
import ProductDesc from './ProductDesc.jsx';  
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
