import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Order.css'; 

const ConfirmOrder = () => {
  const location = useLocation();
  const { product, quantity: initialQuantity } = location.state || {};
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [totalPrice, setTotalPrice] = useState(product ? product.productPrice * (initialQuantity || 1) : 0); 
  const [DeliveryCharges, setDeliveryCharges] = useState(249); 
  const [orderConfirmed, setOrderConfirmed] = useState(false); 
  const [GrandTotal, setGrandTotal] = useState(totalPrice + DeliveryCharges);  
  const [stock, setStock] = useState(null); // State to track available stock
  const [stockMessage, setStockMessage] = useState(''); // State to display stock messages

  useEffect(() => {
    if (product) {
      setTotalPrice(product.productPrice * quantity); 
    }
  }, [quantity, product]); 

  useEffect(() => {
    setGrandTotal(totalPrice + DeliveryCharges);
  }, [totalPrice, DeliveryCharges]);

  useEffect(() => {
    // Fetch current stock quantity for the product
    const fetchStock = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${product._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stock');
        }
        const data = await response.json();
        setStock(data.stock); // Assuming the API returns stock information
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };

    if (product) {
      fetchStock();
    }
  }, [product]);

  const onSubmit = async (data) => {
    if (stock !== null && quantity > stock) {
      setStockMessage(`Remaining stock is ${stock}`);
      return;
    }

    const orderTime = new Date().toLocaleString();
    const formData = {
      ...data,
      productName: product.productName,
      Quantity: quantity,
      totalPrice: totalPrice,
      Image: product.image,
      orderTime: orderTime
    };
  
    try {
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/Login/AdminPanel/Orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (!orderResponse.ok) {
        throw new Error('Network response was not ok');
      }
  
      const orderResponseData = await orderResponse.json();
      console.log('Order placed successfully:', orderResponseData);
  
      const stockUpdateResponse = await fetch(`${import.meta.env.VITE_API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity }) 
      });
  
      if (!stockUpdateResponse.ok) {
        throw new Error('Failed to update stock');
      }
  
      const stockUpdateResponseData = await stockUpdateResponse.json();
      console.log('Stock updated successfully:', stockUpdateResponseData);
  
      const emailResponse = await fetch(`${import.meta.env.VITE_API_URL}/send-order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: data.email,
          orderDetails: {
            orderDate: orderTime,
            items: [{ name: product.productName, quantity, price: product.productPrice }],
            totalAmount: totalPrice
          }
        })
      });
  
      if (!emailResponse.ok) {
        throw new Error('Failed to send confirmation email');
      }
  
      const emailResponseData = await emailResponse.json();
      console.log('Confirmation email sent successfully:', emailResponseData);
  
      setOrderConfirmed(true);
      reset();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <div className="placed-orders-container">
        <div className='Order-head'>
          {product ? (<h1>CONFIRM DELIVERY</h1>) : <h1>No Order to Confirm</h1>}
        </div>
        <div className='Order-div'>
          {product && quantity > 0 ? (
            <>
              <div className='Order-form'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <input id="firstName" placeholder='First Name' {...register('firstName', { required: 'First name is required' })} />
                    {errors.firstName && <span>{errors.firstName.message}</span>}
                  </div>
                  <div>
                    <input id="lastName" placeholder='Last Name' {...register('lastName', { required: 'Last name is required' })} />
                    {errors.lastName && <span>{errors.lastName.message}</span>}
                  </div>
                  <div>
                    <input id="email" placeholder='Email ID' {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
                    {errors.email && <span>{errors.email.message}</span>}
                  </div>
                  <div>
                    <input id="phone" placeholder='Phone No' {...register('phone', { required: 'Phone number is required', pattern: { value: /^[0-9]+$/, message: 'Invalid phone number' } })} />
                    {errors.phone && <span>{errors.phone.message}</span>}
                  </div>
                  <div>
                    <textarea id="city" placeholder='City' {...register('city', { required: 'City name is required' })}></textarea>
                    {errors.city && <span>{errors.city.message}</span>}
                  </div>
                  <div>
                    <textarea id="address" placeholder='Delivery Address' {...register('address', { required: 'Delivery address is required' })}></textarea>
                    {errors.address && <span>{errors.address.message}</span>}
                  </div>
                  <div className='payment-method'>
                    <label className="form-control">
                      <input type="radio" value="Cash on Delivery" {...register('paymentMethod', { required: 'Payment method is required' })} />
                      Cash on Delivery
                    </label>
                    {errors.paymentMethod && <span>{errors.paymentMethod.message}</span>}
                  </div>
                  {stockMessage && <p>{stockMessage}</p>}
                  {orderConfirmed ? (
                    <button className='submit' type="button" disabled>Order Confirmed</button>
                  ) : (
                    <button className='submit' type="submit">Confirm Order</button>
                  )}
                </form>
              </div>
              <div className='headings-order'>
                <h1>Order Details</h1>
                <div className='Order'>  
                  <div className='image-order'>
                  {product.images[0] && <img src={product.images[0]} alt={product.productName} />}  
                  </div>
                  <div className='order-detail'>
                    <h2 className='P-Name'>{product.productName}</h2>
                    <div className="price-info">
                      <p id='item-price'>Price: Rs. {product.productPrice}</p> 
                    </div> 
                    <div className='Totals'> 
                      <span>  
                        <p>Subtotal</p>   
                        <p>{totalPrice}</p>
                        </span>  
                       <span> 
                        <p>Delivery Charges</p>  
                        <p>{DeliveryCharges}</p>
                        </span>  
                        <span id='Grand-Total'> 
                        <p>Grand Total</p>  
                        <p>{GrandTotal}</p>
                        </span> 
                    </div>
                  </div> 
                </div> 
              </div>
            </>
          ) : (
            <p>No product information available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ConfirmOrder;
