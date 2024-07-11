import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    productName:String,  
    Quantity:Number,   
    Image: { type: String },
    totalPrice:Number,
    firstName:String, 
    lastName:String, 
    city:String,   
    email:String, 
    phone:String,  
    address:String,   
    paymentMethod:String, 
    orderTime:String
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
