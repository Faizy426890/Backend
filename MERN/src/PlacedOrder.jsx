import React, { useEffect, useState } from 'react';

const PlacedOrder = () => {
  const [placedOrders, setPlacedOrders] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL; // Use environment variable for API URL

  useEffect(() => {
    const fetchPlacedOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/Login/AdminPanel/Orders/PlacedOrder`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPlacedOrders(data);
        } else {
          console.error('Failed to fetch placed orders');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPlacedOrders();
  }, [apiUrl]); // Add apiUrl to dependency array

  return (
    <div className="placed-orders-container">
      <h2 id='place' className='place'>PLACED ORDERS</h2>
      <div className="placed-orders">
        {placedOrders.length === 0 ? (
          <p>No placed orders found.</p> // Handle empty state
        ) : (
          placedOrders.map(order => (
            <div key={order._id} className="placed-order">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Product Name:</strong> {order.productName}</p>
              <p><strong>Quantity:</strong> {order.Quantity}</p>
              <p><strong>Total Price:</strong> {order.totalPrice}</p>
              <p><strong>Customer:</strong> {order.firstName} {order.lastName}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Address:</strong> {order.address}, {order.city}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Order Placed At:</strong> {order.orderTime}</p>
              <h2 className='place'>Out For Delivery</h2>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlacedOrder;
