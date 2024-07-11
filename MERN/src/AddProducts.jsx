import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './AddProducts.css';

const AddProducts = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submit button

  const onSubmit = async (data) => {
    setIsSubmitting(true); // Disable the submit button
    const formData = new FormData();
    formData.append('productName', data.name);
    formData.append('productPrice', data.price);
    formData.append('productCategory', data.category);
    formData.append('image', data.picture[0]);

    try {
      const response = await fetch(`http://localhost:3001/Login/AdminPanel/Products/${data.category}`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies with request
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();
      setMessage(result.message);
      setIsError(false);
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Error adding product');
      setIsError(true);
    } finally {
      setIsSubmitting(false); // Enable the submit button after the request is complete
    }
  };

  return (
    <div className='AddProducts-Form'>
      {message && <div className={`message ${isError ? 'error' : 'success'}`}>{message}</div>}
      <form className='Form' onSubmit={handleSubmit(onSubmit)}>
        <div className='puts'>
          <label className='labels' htmlFor="name">Product Name</label> <br />
          <input className="inputs" {...register('name', { required: true })} />
          {errors.name && <span>This field is required</span>}
        </div>
        
        <div className='puts'>
          <label className='labels' htmlFor="price">Price</label> <br />
          <input className="inputs" type="number" {...register('price', { required: true })} />
          {errors.price && <span>This field is required</span>}
        </div>

        <div className='puts'>
          <label className='labels' htmlFor="picture">Product Image</label> <br />
          <input className="picture" type="file" {...register('picture', { required: true })} />
          {errors.picture && <span>This field is required</span>}
        </div>

        <div className='puts'>
          <label className='labels' htmlFor="category">Category</label> <br />
          <input className="inputs" {...register('category', { required: true })} />
          {errors.category && <span>This field is required</span>}
        </div>

        <button id='button' type="submit" disabled={isSubmitting} className={isSubmitting ? 'disabled' : ''}>
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
