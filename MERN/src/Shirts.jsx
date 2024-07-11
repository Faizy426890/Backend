import React, { useState, useEffect } from 'react';
import './Shirts.css';

const Shirts = ({ onBuyNow }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products/Shirt', {
          method: 'GET',
          credentials: 'include', // Include cookies with request if needed
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const result = await response.json();
        setProducts(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewAll = () => {
    setShowAllProducts(true); // Update the state to show all products
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className='heads'>
        <h1>SHIRTS</h1>
      </div>
      <section className="shirts-section">
        <div className='Display-Products'>
          {products.slice(0, showAllProducts ? products.length : 4).map((product) => (
            <div key={product._id} className="Product-container">
              <div className='Product-list'>
                {product.image && <img src={product.image} alt={product.productName} />} 
                <h2>{product.productName}</h2>
                <p>Rs: {product.productPrice}</p>    
              </div>
              <div className="wrapper">
                <a className='a' onClick={() => onBuyNow(product)}>Buy Now</a>
              </div>
            </div> 
          ))}
        </div>
      </section> 
      {!showAllProducts && (
        <div className="wrapper">
          <a id='a' className='a' onClick={handleViewAll}>View All Products</a>
        </div> 
      )} 
    </>
  );
}

export default Shirts;
