import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shirts.css';

const Shirts = ({ onBuyNow }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL; // Fetch API URL from environment variables

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products`, {
          method: 'GET',
          credentials: 'include',
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
  }, [apiUrl]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleProductClick = (product) => {
    navigate('/ProductDesc', { state: { product } });
  };

  const handleBuyNowClick = (e, product) => {
    e.stopPropagation(); // Prevent triggering product click
    onBuyNow(product);
  };

  return (
    <>
      <div className='heads'>
        <h1>TOP PRODUCTS</h1>
      </div>
      <section className="shirts-section">
        <div className='Display-Products'>
          {products.slice(0, 4).map((product) => (
            <div 
              key={product._id} 
              className="Product-container" 
              onClick={() => handleProductClick(product)}
            >
              <div className='Product-list'>
                {product.images[0] && <img src={product.images[0]} alt={product.productName} />}
                <h2>{product.productName}</h2>
                <div className='prices'> 
                  <p className='old-price'>PKR: {product.oldPrice}</p>
                  <p>PKR: {product.productPrice}</p>     
                </div>
                {product.productStock === 0 ? (
                  <p className="sold-out">Sold Out</p>
                ) : (
                  <a 
                    className='a' 
                    onClick={(e) => handleBuyNowClick(e, product)}
                  >
                    Buy Now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Shirts;
