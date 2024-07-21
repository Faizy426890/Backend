import React, { useState} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx';  
import './Home.css';  
import Shirts from './Shirts.jsx'; 
import Cover from './images/Cover.jpg';    
import About from './About.jsx';  // Import the About component  
const Home = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const navigate = useNavigate();


  const handleShowAllProducts = () => {
    setShowAllProducts(true);
  };

  const handleBuyNow = (product) => {
    navigate('/confirmOrder', { state: { product } });
  }; 

  return ( 
    <>
      <Nav   
        showAllProducts={handleShowAllProducts} 
      />
      <Routes> 
        <Route path="/" element={ 
          <div>
            <section className='cover-photo'>  
              <img src={Cover} alt="Cover" /> 
              <div className="cover-text"> 
                <h1><span className="highlight">UNLEASH</span> YOUR LOOK</h1>  
                <a>Discover the latest trends in fashion and update your wardrobe with our new collection.</a> 
                <button className='Shop-button'>
                  SHOP NOW
                  <span className="first"></span>
                  <span className="second"></span>
                  <span className="third"></span>
                  <span className="fourth"></span>
                </button>
              </div>
            </section>  
            <div>
              <Shirts showAllProducts={showAllProducts} onBuyNow={handleBuyNow} />  
            </div>
          </div>
        } />
        <Route path="/about" element={<About />} /> 
      </Routes> 
    </>
  );
}

export default Home;
