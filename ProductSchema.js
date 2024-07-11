import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: String,
  productPrice: Number,
  productCategory: String,
  image: { type: String } 
});

const Product = mongoose.model('Product', productSchema);

export default Product;
