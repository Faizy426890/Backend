import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: String,
  productPrice: Number,
  productDescription: String, 
  Stock:Number,
  images: [{
    type: String
  }],
});

const Product = mongoose.model('Product', productSchema);

export default Product;
