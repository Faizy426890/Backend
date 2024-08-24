import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx';  
import './Home.css';  
import Shirts from './Shirts.jsx'; 
import Cover from './images/Cover.jfif';     
import Reviews from './Reviews.jsx';
import About from './About.jsx';  // Import the About component  

const Home = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const navigate = useNavigate(); 
  const shirtsRef = useRef(null);

  useEffect(() => {
    alert("Order 2 products on the same day and get free delivery on the 2nd one. Reach us on WhatsApp to claim the free delivery of the second order...");
  }, []);

  const handleShowAllProducts = () => {
    setShowAllProducts(true);
  };

  const handleBuyNow = (product) => {
    navigate('/confirmOrder', { state: { product } });
  }; 

  const handleShopNowClick = () => {
    shirtsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return ( 
    <>
      <Nav showAllProducts={handleShowAllProducts} />
      <Routes> 
        <Route path="/" element={ 
          <div>
            <section className='cover-photo'>  
              <img src={Cover} alt="Cover" /> 
              <div className="cover-text"> 
                <h1><span className="highlight">UNLEASH</span> YOUR LOOK</h1>  
                <a>Discover the latest trends in fashion and update your wardrobe with our new collection.</a> 
                <button className='Shop-button' onClick={handleShopNowClick}>
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
            <Reviews/>
          </div>
        } />
        <Route path="/about" element={<About />} /> 
      </Routes> 
    </>
  );
}

export default Home;
