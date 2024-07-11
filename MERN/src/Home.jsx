import React, { useState, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx';  
import './Home.css'; 
import Shirts from './Shirts.jsx'; 
import Cargos from './Cargos.jsx';
import Cover from './images/Cover.jpg';   

const Home = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const shirtsRef = useRef(null);
  const cargosRef = useRef(null);
  const homeRef = useRef(null);
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShowAllProducts = () => {
    setShowAllProducts(true);
    scrollToSection(shirtsRef);  
  };

  const handleBuyNow = (product) => {
    navigate('/confirmOrder', { state: { product } });
  };
  return ( 
    <>
      <div ref={homeRef}>
        <Nav 
          scrollToShirts={() => scrollToSection(shirtsRef)} 
          scrollToCargos={() => scrollToSection(cargosRef)}   
          scrollToHome={() => scrollToSection(homeRef)}  
          showAllProducts={handleShowAllProducts}   // Pass the handler to Navbar
        /> 
      </div>
      <section className='cover-photo'>  
        <img src={Cover} alt="Cover" /> 
        <div className="cover-text"> 
          <h1><span className="highlight">UNLEASH</span> YOUR LOOK</h1>  
          <a>Discover the latest trends in fashion and update your wardrobe with our new collection.</a> 
          <button onClick={() => scrollToSection(shirtsRef)} className='Shop-button'>
            SHOP NOW
            <span className="first"></span>
            <span className="second"></span>
            <span className="third"></span>
            <span className="fourth"></span>
          </button>
        </div>
      </section>  
      <div ref={shirtsRef}>
        <Shirts showAllProducts={showAllProducts} onBuyNow={handleBuyNow} />  
      </div>
      <div ref={cargosRef}>
        <Cargos showAllProducts={showAllProducts} onBuyNow={handleBuyNow} />  
      </div> 
    </>
  );
}

export default Home;
