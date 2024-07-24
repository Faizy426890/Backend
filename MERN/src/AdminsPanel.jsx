import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Route, Routes } from 'react-router-dom';
import './adminpanel.css';
import logo from './images/Logo.png';
import AddProductImage from './images/Addproduct-png.webp';
import cross from './images/Cross.png';
import menu from './images/menubar.png';
import AddProducts from './AddProducts';  
import CheckOrders from './CheckOrders';  
import PlacedOrder from './PlacedOrder'; // Ensure this import is correct
import dropdown from './images/Dropdown.png';   
import dropup from './images/Dropup.png'; 

const AdminPanel = () => {
  const navigate = useNavigate();
  const [controlVisible, setControlVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  const [ordersVisible, setOrdersVisible] = useState(false); // State for orders visibility
  const apiUrl = import.meta.env.VITE_API_URL; // Fetch API URL from environment variables

  const handleShowControl = () => {
    setControlVisible(!controlVisible);
  };

  const handleAddProductClick = () => { 
    setControlVisible(!controlVisible);
    navigate('/Login/AdminPanel/AddProducts'); 
  }; 

  const handleOrdersClick = () => { 
    setControlVisible(!controlVisible);
    navigate('/Login/AdminPanel/CheckOrders');
  }; 

  const handlePlaceOrdersClick = () => { 
    setControlVisible(!controlVisible);
    navigate('/Login/AdminPanel/PlacedOrder');
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products`, { // Corrected URL with backticks
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/products/${id}`, { // Corrected URL with backticks
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); // Toggle dropdown visibility
    setOrdersVisible(false); // Hide orders when toggling dropdown
  };

  const handleToggleOrders = () => {
    setOrdersVisible(!ordersVisible); // Toggle orders visibility
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/Login/AdminPanel`, { // Corrected URL with backticks
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        // Continue with admin panel logic if authorized
      } catch (error) {
        console.error('Error:', error);
        navigate('/Login'); // Redirect to login page if unauthorized
      }
    };

    checkLoginStatus();
    fetchProducts(); // Fetch products on component mount
  }, [navigate]);

  return (
    <>
      <section className='Admin-Container'>
        <section className={`Admin-Control ${controlVisible ? 'active' : ''}`}>
          <div className='Admin-Logo'>
            <img src={logo} className='AdminLogo' alt="Admin Logo" />
            <img src={cross} className='cross' onClick={handleShowControl} alt="Close" />
          </div>
          <div className='Admin-Dash'>
            <div className='Add-product' onClick={handleAddProductClick}>
              <img src={AddProductImage} alt="Add Product" />
              <p>Add Products</p>
            </div> 
            <div className='order-div'>  
              <div className='orders'>
                <p>Orders</p> 
                <img src={dropdownVisible ? dropup : dropdown} onClick={handleToggleDropdown} alt="Dropdown" />
              </div>
              {dropdownVisible && (
                <div className='order-details'>  
                  <p className='p' onClick={handleOrdersClick}>Pending Orders</p> 
                  <p className='p' onClick={handlePlaceOrdersClick}>Out for Delivery</p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className='Admin-ProdcutsGrid'>
          <div className='product-heading'>
            <img src={menu} className='show-control' onClick={handleShowControl} alt="Show Control" />
            <h2>ADMIN PANEL</h2>
          </div>
          <Routes>
            <Route path="/" element={
              <div className='products-list'>
                {products.map((product) => (
                  <div key={product._id}>
                    <div className='product-item'>
                      <img src={product.images[0]} alt={product.productName} />
                      <button className='button' onClick={() => handleDeleteProduct(product._id)}>Delete Product</button>
                    </div>
                    <div className='Product-details'>
                      <h3>{product.productName}</h3>
                      <p>{product.productPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            } />
            <Route path="/Login/AdminPanel/AddProducts" element={<AddProducts />} /> 
            <Route path="/Login/AdminPanel/CheckOrders" element={<CheckOrders />} />  
            <Route path="/Login/AdminPanel/PlacedOrder" element={<PlacedOrder />} />
          </Routes>
          <Outlet /> {/* This is where nested routes will be rendered */}
        </section>
      </section>
    </>
  );
};

export default AdminPanel;
