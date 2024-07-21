import React from 'react'
import './Footer.css' 
import Fb from './images/fb.png';
import insta from './images/insta-png.webp';
import mail from './images/mail.png'; 
import whatsapp from './images/whatsapp.png';
const Footer = () => {
  return ( 
    <> 
    <hr className='line' />
<footer className="footer-distributed">

      <div className="footer-left">

        <h3>Company<span>logo</span></h3>

        <p className="footer-links">
          <a href="/" className="link-1">Home</a>
        
          <a href="/About">About</a>
          
          <a href="#">Contact</a>
        </p>

        <p className="footer-company-name">Witty Wardrobe © 2022</p>
      </div>

      <div className="footer-center">

        <div>
          <i className="fa fa-map-marker"></i>
          <p><span>Company</span> Lahore,Pakistan</p>
        </div>

        <div>
          <i className="fa fa-phone"></i>
          <p>+923064275081</p>
        </div>

        <div>
          <i className="fa fa-envelope"></i>
          <p><a href="">wittywardrobe24@gmail.com</a></p>
        </div>

      </div>

      <div className="footer-right">

        <p className="footer-company-about">
          <span>About the company</span>
          Witty Wardrobe offers trendy, high-quality fashion for all. Our stylish collections blend comfort and creativity, perfect for expressing your unique personality.
        </p>

        <div className="footer-icons">
      <div className='social-icons'>
          <a href="https://www.facebook.com/wittywardrobe24?mibextid=ZbWKwL"><img src={Fb} alt="" /> <i className="fa fa-facebook"></i></a>
          <a href="https://www.instagram.com/wittywardrobe24?igsh=dG9kbTBldGJqNWl4"> <img src={insta} alt="" /><i className="fa fa-twitter"></i></a>
          <a href="#"> <img src={mail} alt="" /><i className="fa fa-linkedin"></i></a>
          <a href="#"><img src={whatsapp} alt="" /><i className="fa fa-github"></i></a>
          </div>
        </div>

      </div>

    </footer> 
    </>
  )
}

export default Footer;
