import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import Product from './ProductSchema.js';
import upload from './multerconfig.js'; 
import { uploadToCloudinary } from './Cloudinary.js';
import fs from 'fs';
import sendOrderConfirmationEmail from './emailService.js';
import sendPlacedOrderEmail from './OrderPlacedMail.js';
import Order from './OrderSchema.js';
import PlacedOrder from './PlacedOrderSchema.js';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique IDs

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// CORS configuration
app.use(cors({
  origin: 'https://www.wittywardrobe.store',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Basic route
app.get('/', (req, res) => {
  res.send('MongoDB connection status will be checked on /test-db');
});

// Login route
app.post('/Login', basicAuth ,(req, res) => {
  // Login is successful if basicAuth middleware passes
  res.json({ message: 'Login successful' });
});

// Admin panel route with basic auth check
app.get('/Login/Check', (req, res) => {
  res.json({ message: 'Welcome to the admin panel!' });
});

// Add product route
app.post('/Login/AdminPanel/Products', upload.array('images', 3), async (req, res) => {
  try {
    const { productName, productPrice, oldPrice , productDescription , productStock} = req.body;
    const imageUrls = [];

    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('No files uploaded');
    }

    console.log('Files received:', req.files);

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      imageUrls.push(result.url);
    }

    const newProduct = new Product({
      productName,
      productPrice,  
      oldPrice,
      productStock,
      images: imageUrls,
      productDescription,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully.' });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product.' });
  }
});

// Get products route
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// Delete product route
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// Create order route
app.post('/Login/AdminPanel/Orders', async (req, res) => {
  try {
    const { Quantity, productName, Image, address, city, email, firstName, lastName, paymentMethod, phone, totalPrice, orderTime } = req.body;

    // Generate a unique order ID
    const orderId = uuidv4();

    const newOrder = new Order({
      orderId,
      productName,
      Quantity,
      Image,
      firstName,
      lastName,
      city,
      email,
      address,
      phone,
      totalPrice,
      paymentMethod,
      orderTime,
    });

    const savedOrder = await newOrder.save();

    // Send order confirmation email with order ID
    await sendOrderConfirmationEmail(email, {
      orderId, // Include orderId in the email details
      productName,
      Quantity,
      Image,
      address,
      city,
      paymentMethod,
      phone,
      totalPrice,
      orderTime,
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place order route
app.post('/Login/AdminPanel/Orders/PlacedOrder', async (req, res) => {
  try {
    const { Quantity, productName, Image, address, city, email, firstName, lastName, paymentMethod, phone, totalPrice, orderTime, _id } = req.body;

    const placedOrder = new PlacedOrder({
      Quantity,
      productName,
      Image,
      address,
      city,
      email,
      firstName,
      lastName,
      paymentMethod,
      phone,
      totalPrice,
      orderTime,
    });

    await placedOrder.save();

    const deletedOrder = await Order.findByIdAndDelete(_id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send placed order confirmation email with the order ID from the deleted order
    await sendPlacedOrderEmail(email, {
      orderId: deletedOrder.orderId, // Include orderId in the email details
      productName,
      Quantity,
      Image,
      address,
      city,
      paymentMethod,
      phone,
      totalPrice,
      orderTime,
    });

    res.status(201).json({ message: 'Order placed successfully', order: placedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
  }
});

// Get all orders route
app.get('/Login/AdminPanel/Orders',async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Delete order route
app.delete('/Login/AdminPanel/Orders/:id',async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order.' });
  }
});

// Get placed orders route
app.get('/Login/AdminPanel/Orders/PlacedOrder',async (req, res) => {
  try {
    const placedOrders = await PlacedOrder.find().sort({ orderTime: -1 });
    res.status(200).json(placedOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch placed orders.' });
  }
});

// Send order confirmation email route
app.post('/send-order-confirmation', async (req, res) => {
  const { to, orderDetails } = req.body;

  try {
    await sendOrderConfirmationEmail(to, orderDetails);
    res.status(200).json({ message: 'Order confirmation email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send order confirmation email' });
  }
});

// Send placed order confirmation email route
app.post('/send-Placed-confirmation', async (req, res) => {
  const { to, orderDetails } = req.body;

  try {
    await sendPlacedOrderEmail(to, orderDetails);
    res.status(200).json({ message: 'Order Placement email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send order Placement email' });
  }
});

// Start the server after successful database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

export default app; // Export the app
