import React, { useState, useEffect } from 'react';
import './Desc.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Fb from './images/fb.png';
import insta from './images/insta-png.webp';
import mail from './images/mail.png'; 
import whatsapp from './images/whatsapp.png';

const ProductDesc = () => {
  const location = useLocation();
  const { product } = location.state;
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [transitionClass, setTransitionClass] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products', {
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

  useEffect(() => {
    setQuantity(1); // Reset quantity when product changes
  }, [product]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleProductClick = (newProduct) => {  
    navigate('/ProductDesc', { state: { product: newProduct } });
    window.location.reload(); // Reload the page to update the product
  };

  const handleBuyNow = () => {
    navigate('/ConfirmOrder', { state: { product, quantity } });
  };

  const handleThumbnailClick = (image) => {
    setTransitionClass('fade-out');
    setTimeout(() => {
      setMainImage(image);
      setTransitionClass('');
    }, 300);
  };

  // Render loading message while fetching data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render error message if fetch fails
  if (error) {
    return <div>{error}</div>;
  } 

  return (
    <>
      <div className='Desc-container'>
        <div className='Desc-Img'>
          <img className={`desc-image ${transitionClass}`} src={mainImage} alt={product.productName} />
          <div className='desc-images'> 
          {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.productName}
                onClick={() => handleThumbnailClick(product.images[0])}
                style={{ cursor: 'pointer' }} // Optional: Change cursor to pointer on hover
              />
            )}

            {product.images[1] && (
              <img
                src={product.images[1]}
                alt={product.productName}
                onClick={() => handleThumbnailClick(product.images[1])}
                style={{ cursor: 'pointer' }} // Optional: Change cursor to pointer on hover
              />
            )}
            {product.images[2] && (
              <img
                src={product.images[2]}
                alt={product.productName}
                onClick={() => handleThumbnailClick(product.images[2])}
                style={{ cursor: 'pointer' }} // Optional: Change cursor to pointer on hover
              />
            )}
          </div>
        </div>
        <div className='Desc-data'>
          <h1>{product.productName}</h1>
          <p>Rs: {product.productPrice}</p>
          <hr className='full' />
          <div className="quantity-control">
            <button type="button" className="minus" onClick={handleDecrement}>-</button>
            <span className="quantity">{quantity}</span>
            <button type="button" className="plus" onClick={handleIncrement}>+</button>
          </div>
          <a className='a' onClick={handleBuyNow}>Buy Now</a>
          <div className='social-icons'>
            <a href="https://www.facebook.com/wittywardrobe24?mibextid=ZbWKwL"> <img src={Fb} alt="Facebook" /> </a>
            <a href="https://www.instagram.com/wittywardrobe24?igsh=dG9kbTBldGJqNWl4"><img src={insta} alt="Instagram" /></a>
            <img id='mail' src={mail} alt="Mail" /> 
            <img src={whatsapp} alt="WhatsApp" />
          </div>
          <div className='Description'>
            <h2>Description</h2> 
            <p>{product.productDescription}</p>
          </div>
        </div> 
      </div>
      <div className='Section-MayLike'>  
        <hr className='lin' />
        <div className='MayLike-Head'>
          <p>You May Also Like</p>
        </div>
        <section className="shirts-section">
          <div className='Display-Products'>
            {products.slice(4, 7).map((product) => (
              <div
                key={product._id}
                className="Product-container"
                onClick={() => handleProductClick(product)}
              >
                <div className='Product-list'>
                  {product.image && <img src={product.image} alt={product.productName} />}
                  <h2>{product.productName}</h2>
                  <p>Rs: {product.productPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default ProductDesc;
