import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './AddProducts.css';

const AddProducts = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    const wordCount = data.description.trim().split(/\s+/).length;
    if (wordCount > 100) {
      setError('description', { type: 'manual', message: 'Description cannot exceed 100 words' });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('productName', data.name);
    formData.append('productPrice', data.price);
    formData.append('images', data.picture1[0]);
    formData.append('images', data.picture2[0]);
    formData.append('images', data.picture3[0]);
    formData.append('productDescription', data.description);

    try {
      const response = await fetch('http://localhost:3001/Login/AdminPanel/Products', {
        method: 'POST',
        body: formData,
        credentials: 'include',
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
      setIsSubmitting(false);
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
          <label className='labels' htmlFor="picture1">Product Image 1</label> <br />
          <input className="picture" type="file" {...register('picture1', { required: true })} />
          {errors.picture1 && <span>This field is required</span>}
        </div>

        <div className='puts'>
          <label className='labels' htmlFor="picture2">Product Image 2</label> <br />
          <input className="picture" type="file" {...register('picture2', { required: true })} />
          {errors.picture2 && <span>This field is required</span>}
        </div> 

        <div className='puts'>
          <label className='labels' htmlFor="picture3">Product Image 3</label> <br />
          <input className="picture" type="file" {...register('picture3', { required: true })} />
          {errors.picture3 && <span>This field is required</span>}
        </div>

        <div className='puts'>
          <label className='labels' htmlFor="description">Description</label> <br />
          <textarea
            id='description'
            className="description-textarea"
            {...register('description', { required: true })}
          />
          {errors.description && <span>{errors.description.message}</span>}
        </div>

        <button id='button' type="submit" disabled={isSubmitting} className={isSubmitting ? 'disabled' : ''}>
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
