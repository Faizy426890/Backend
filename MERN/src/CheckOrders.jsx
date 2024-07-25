import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './checkorder.css';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80vw',
    maxHeight: '80vh',
    overflow: 'auto',
    backgroundColor: '#838485',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const CheckOrders = () => {
  const [orders, setOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [deliveryClicked, setDeliveryClicked] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Login/AdminPanel/Orders`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async () => {
    try {
      if (deleteOrderId) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Login/AdminPanel/Orders/${deleteOrderId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
  
        if (response.ok) {
          setOrders(orders.filter(order => order._id !== deleteOrderId));
          console.log('Order deleted successfully');
        } else {
          throw new Error('Failed to delete order');
        }
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      closeModal();
    }
  };
  
  const handlePlaceOrder = async (order) => {
    try {
      const currentTime = new Date().toLocaleString();
      const orderWithTime = { ...order, orderTime: currentTime };

      const postResponse = await fetch(`${import.meta.env.VITE_API_URL}/Login/AdminPanel/Orders/PlacedOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderWithTime),
      });

      if (!postResponse.ok) {
        throw new Error('Failed to place order');
      }

      setOrders(orders.filter(o => o._id !== order._id));
      console.log('Order placed successfully and removed from list');
      setDeliveryClicked(true);

      const emailResponse = await fetch(`${import.meta.env.VITE_API_URL}/send-Placed-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: order.email,
          orderDetails: {
            orderDate: currentTime,
            items: [{ name: order.productName, quantity: order.Quantity, price: order.totalPrice }],
            totalAmount: order.totalPrice
          }
        }),
        credentials: 'include',
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send confirmation email');
      }

      console.log('Confirmation email sent successfully');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  
  const openModal = (orderId) => {
    setDeleteOrderId(orderId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDeleteOrderId(null);
    setDeliveryClicked(false);
  };

  return (
    <div className='show-order'> 
      <h2 className='place'>PENDING ORDERS</h2>
      {orders
        .slice()
        .map(order => (
          <div key={order._id} className='order'>
            <div className='order-flex'>
              <div id='order-details'>
                <h3>Order ID: {order._id}</h3>
                <p><strong>Product Name:</strong> {order.productName}</p>
                <p><strong>Quantity:</strong> {order.Quantity}</p>
                <p><strong>Total Price:</strong> {order.totalPrice}</p>
                <p><strong>Customer:</strong> {order.firstName} {order.lastName}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Address:</strong> {order.address}, {order.city}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Order Time:</strong> {order.orderTime}</p>
              </div>
            </div>
            <div className='Order-image'>
              <img src={order.Image} alt="" />
            </div>
            <button id='Cancel' className='a' onClick={() => openModal(order._id)}>Cancel order</button>
            <button id='delivery' className={`a ${deliveryClicked ? 'grey-bg' : ''}`} onClick={() => handlePlaceOrder(order)}>Out for Delivery</button>
          </div>
        ))}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Confirm Delete Modal"
      >
        <h2>Confirm Cancel</h2>
        <p>Are you sure you want to cancel this order?</p>
        <div className="modal-buttons">
          <button className="modal-button-yes" onClick={handleDeleteOrder}>Yes</button>
          <button className="modal-button-no" onClick={closeModal}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default CheckOrders;
