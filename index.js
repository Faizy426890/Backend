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
import Review from './ReviewSchema.js';

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
// Middleware for basic authentication
const basicAuth = (req, res, next) => {
  const { username, password } = req.body;

  console.log('Received credentials:', { username, password });

  if (username === process.env.BASIC_AUTH_USERNAME && password === process.env.BASIC_AUTH_PASSWORD) {
    req.user = username;
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};



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
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // The quantity of the product being purchased

  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if there is enough stock
    if (product.productStock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Decrement the stock quantity
    product.productStock -= quantity;
    await product.save();

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error });
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

    res.status(201).json({ message: 'Order placed successfully', order: placedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
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
app.post('/reviews', async (req, res) => {
  try {
    const { name, email, review } = req.body;
    
    // Create a new review without the photos array
    const newReview = new Review({
      name,
      email,
      review,
    });

    await newReview.save(); // Save the review
    res.status(201).json({ message: 'Review submitted successfully', newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review', error });
  }
});

app.get('/reviews',async (req, res) => {
  try {
    const Reviews = await Review.find();
    res.status(200).json(Reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Reviews.' });
  }
});

// Start the server after successful database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

export default app; // Export the app
