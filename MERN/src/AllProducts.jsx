import React, { useState, useEffect, useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Shirts.css'; 

const AllProducts = ({ onBuyNow }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => { 
      const apiUrl = import.meta.env.VITE_API_URL; 
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
  }, []);

  const memoizedProducts = useMemo(() => products, [products]);

  const handleProductClick = (product) => {
    navigate('/ProductDesc', { state: { product } });
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    if (product.productStock > 0) { // Ensure stock is greater than 0 before proceeding
      onBuyNow(product);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className='AllProduct-head'>
        <h1>OUR COLLECTION</h1>
      </div>
      <section className="shirts-section">
        <div className='Display-Products'>
          {memoizedProducts.map((product) => (
            <div key={product._id} className="Product-container" onClick={() => handleProductClick(product)}>
              <div className='Product-list'>
                {product.images[0] && <img src={product.images[0]} alt={product.productName} />}    
                <h2>{product.productName}</h2> 
                <div className='prices'>
                  <p className='old-price'>PKR: {product.oldPrice}</p> 
                  <p>PKR: {product.productPrice}</p>     
                </div>
              </div>
              <div className="wrapper">
                {product.productStock === 0 ? (
                  <a className='sold-out'>Sold Out</a>
                ) : (
                  <a className='a' onClick={(e) => handleBuyNow(e, product)}>Buy Now</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section> 
    </>
  );
}

export default AllProducts;
