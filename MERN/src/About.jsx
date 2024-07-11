import React from 'react';
import './about.css'; // Import your CSS file for styling
const About = () => {
  return (  
    <>
    <div className="about-container">
      <h2>ABOUT US</h2>
      <p>Welcome to Fashion Nova, your premier destination for cutting-edge fashion trends and statement pieces that empower your individual style. Since our inception in 2024, we've been at the forefront of fashion innovation, offering a curated selection of clothing and accessories that inspire confidence and self-expression.</p>
      
      <h3>Our Story</h3>
      <p>Fashion Nova began with a bold vision: to make high fashion accessible to everyone, everywhere. Founded by fashion enthusiasts who believe in inclusivity and diversity, our journey started with a commitment to redefine fashion norms and celebrate individuality through trend-setting designs.</p>
      
      <h3>Our Mission</h3>
      <p>At Fashion Nova, our mission is to empower you to feel your best, every day. We curate the latest trends and timeless classics, ensuring that each piece in our collection reflects our dedication to quality, style, and affordability. We're not just a fashion brand; we're a movement that encourages you to embrace your unique identity with pride.</p>
      
      <h3>What Sets Us Apart</h3>
      <ul className="custom-list">
        <li><strong>Trendsetting Styles:</strong> Stay ahead of the curve with our constantly updated collections that reflect the latest fashion trends.</li>
        <li><strong>Inclusive Sizing:</strong> We believe fashion should be for every body. Explore our diverse range of sizes to find the perfect fit for you.</li>
        <li><strong>Affordable Luxury:</strong> Experience the luxury of high-end fashion at prices that won't break the bank.</li>
      </ul>
      
      <h3>Our Promise</h3>
      <ul className="custom-list">
        <li><strong>Quality Assurance:</strong> Each Fashion Nova piece is crafted with care and attention to detail, ensuring superior quality and comfort.</li>
        <li><strong>Customer Satisfaction:</strong> Your satisfaction is our priority. We're dedicated to providing exceptional customer service and a seamless shopping experience.</li>
        <li><strong>Social Responsibility:</strong> Fashion Nova is committed to sustainability and ethical practices in everything we do, from sourcing to production.</li>
      </ul>
      
      <h3>Join Our Community</h3>
      <p>Thank you for choosing Fashion Nova. Whether you're a trendsetter or a fashion enthusiast, we invite you to explore our collections, join our community, and discover why Fashion Nova is more than just a brand—it's a lifestyle.</p>
      
      <h3>Connect With Us</h3>
      <p>Got a question or feedback? Reach out to our friendly customer support team at [Contact Email or Phone Number]. Follow us on [Social Media Platform] for style inspiration, exclusive offers, and the latest fashion updates.</p>
    </div> 
    </>
  );
}

export default About;
