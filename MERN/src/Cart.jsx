import React from 'react' 
import Cross from './images/Cross.png';  
import { useDispatch } from 'react-redux';
import { closeCart} from './CartSlice.js';
import './cart.css';   
function Cart() {  
  const dispatch = useDispatch();
  const handleToggleCart = () => {
    dispatch(closeCart());
  };
  return ( 
    <div className='cart-containers'>
      <div className='cart-heading'> 
      <img onClick={handleToggleCart} src={Cross} alt="" /> 
       <h1> CART </h1>
      </div>
    </div>
  )
}

export default Cart
