import mongoose from 'mongoose';

const PlaceOrderSchema = new mongoose.Schema({
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

const PlaceOrder = mongoose.model('PlacedOrder', PlaceOrderSchema);

export default PlaceOrder;
