import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import mongoose for DB connection
import { login } from './Admin.js';
import { connectToDatabase } from './DB.js';
import Product from './ProductSchema.js';
import upload from './multerconfig.js';
import { uploadToCloudinary } from './Cloudinary.js';
import fs from 'fs';
import path from 'path';
import sendOrderConfirmationEmail from './emailService.js'; 
import sendPlacedOrderEmail from './OrderPlacedMail.js';
import Order from './OrderSchema.js';
import PlacedOrder from './PlacedOrderSchema.js';

dotenv.config();

// Connect to MongoDB
connectToDatabase(); // Ensure this function is defined in DB.js and handles DB connection

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Update this in .env
  credentials: true,
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, 
}));

// Middleware to check session before accessing AdminPanel
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(401).json({ message: 'Unauthorized' }); // Return unauthorized response if session is not valid
  }
};

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the backend API');
});

// Test DB connection route
app.get('/test-db', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); 
    res.status(200).send('Database connection successful');
  } catch (error) {
    res.status(500).send('Database connection failed');
    console.error('Database connection error:', error);
  }
});

// Login route
app.post('/Login', login);

// Admin panel route with session check
app.get('/Login/AdminPanel', requireLogin, (req, res) => {
  res.json({ message: 'Welcome to the admin panel!' });
});

// Add product route
app.post('/Login/AdminPanel/Products', upload.array('images', 3), async (req, res) => {
  try {
    const { productName, productPrice, productDescription } = req.body;
    const imageUrls = [];

    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('No files uploaded');
    }  

    for (const file of req.files) {
      const filePath = file.path;

      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      const result = await uploadToCloudinary(filePath);
      imageUrls.push(result.url);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const newProduct = new Product({
      productName,
      productPrice,
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

    const newOrder = new Order({
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
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
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

// Get all orders route
app.get('/Login/AdminPanel/Orders', requireLogin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Delete order route
app.delete('/Login/AdminPanel/Orders/:id', requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order.' });
  }
});

// Place order route
app.post('/Login/AdminPanel/Orders/PlacedOrder', requireLogin, async (req, res) => {
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

    res.status(201).json({ message: 'Order placed successfully', order: placedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
  }
});

// Get placed orders route
app.get('/Login/AdminPanel/Orders/PlacedOrder', requireLogin, async (req, res) => {
  try {
    const placedorders = await PlacedOrder.find().sort({ orderTime: -1 });
    res.status(200).json(placedorders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch placed orders.' });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
