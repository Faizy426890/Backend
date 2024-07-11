import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './navbar.css';
import Cross from './images/Cross.png';
import Logo from './images/Fashion-Nova-Logo.png';
import menu from './images/menubar.png';

const Navbar = ({ scrollToShirts, scrollToCargos, scrollToHome, showAllProducts }) => {
  const [controlVisible, setControlVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  const handleShowControl = () => {
    setControlVisible(!controlVisible);
  }; 
  const handleShowControls = () =>{  
     navigateHome();
    setControlVisible(!controlVisible);
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
            <a onClick={scrollToHome}>Home</a>
          </li>
          <li onClick={navigateHome}>
            <a onClick={scrollToShirts}>Shirts</a>
          </li>
          <li onClick={navigateHome}>
            <a onClick={scrollToCargos}>Cargos</a>
          </li>
          <li onClick={navigateHome}>
            <a onClick={showAllProducts}>All Products</a>
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
            <a onClick={scrollToHome}>Home</a>
          </li>
          <li onClick={handleShowControls}>
            <a onClick={scrollToShirts}>Shirts</a>
          </li>
          <hr className='hr' />
          <li onClick={handleShowControls}>
            <a onClick={scrollToCargos}>Cargos</a>
          </li>
          <hr className='hr' />
          <li onClick={handleShowControls}>
            <a onClick={showAllProducts}>All Products</a>
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
