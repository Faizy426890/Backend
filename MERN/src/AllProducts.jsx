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

  const memoizedProducts = useMemo(() => products, [products]);

  const handleProductClick = (product) => {
    navigate('/ProductDesc', { state: { product } });
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the product container
    onBuyNow(product);
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
        <h1>ALL PRODUCTS</h1>
      </div>
      <section className="shirts-section">
        <div className='Display-Products'>
          {memoizedProducts.map((product) => (
            <div key={product._id} className="Product-container" onClick={() => handleProductClick(product)}>
              <div className='Product-list'>
                {product.images[0] && <img src={product.images[0]} alt={product.productName} />} 
                <h2>{product.productName}</h2>
                <p>Rs: {product.productPrice}</p>    
              </div>
              <div className="wrapper">
                <a className='a' onClick={(e) => handleBuyNow(e, product)}>Buy Now</a>
              </div>
            </div>
          ))}
        </div>
      </section> 
    </>
  );
}

export default AllProducts;
