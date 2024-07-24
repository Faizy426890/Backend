import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './navbar.css';
import Cross from './images/Cross.png';
import Logo from './images/Capture.png';
import menu from './images/menubar.png';  

const Navbar = () => {
  const [controlVisible, setControlVisible] = useState(false);  
  const navigate = useNavigate(); // Initialize useNavigate hook 
  
  const handleShowControls = () =>{  
     navigateHome();
    setControlVisible(!controlVisible);
  }   
  const handleShowControl = () =>{  
   setControlVisible(!controlVisible);
 }  
  const showAllProduct = () => { 
    navigate('/AllProducts');
  }
  
const navigateHome = () => { 
navigate('/');
}
  const navigateToAbout = () => {
    navigate('/about'); // Programmatically navigate to About Us page
  };
 
  return (
    <>
      <nav className='navbar'>
        <img className='menu' src={menu} alt="" onClick={handleShowControl} />
        <div className='Logo'>
          <img src={Logo} alt="" />
        </div>
        <ul className='list'>
          <li onClick={navigateHome}>
            <a>Home</a>
          </li>
          <li>
            <a onClick={showAllProduct}>All Products</a>
          </li>
          <li>
            <a onClick={navigateToAbout}>About Us</a> {/* Use onClick to trigger navigation */}
          </li>
        </ul>
      </nav>
      <nav className={`mobile-nav ${controlVisible ? 'active' : ''}`}>
        <div className='mobile-nav-heading'>
          <img className='Cross' src={Cross} alt="" onClick={handleShowControl} />
        </div>
        <ul className='mobile-list'>
          <li onClick={handleShowControls}>
            <a >Home</a>
          </li>
          <hr className='hr' />
          <li onClick={handleShowControl}>
          <a onClick={showAllProduct}>All Products</a>
          </li>
          <hr className='hr' />
          <li onClick={handleShowControl}>
            <a onClick={navigateToAbout}>About Us</a> {/* Use onClick to trigger navigation */}
          </li>
          <hr className='hr' />
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
