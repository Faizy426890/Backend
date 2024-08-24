import React from 'react';
import { useForm } from 'react-hook-form';
import './ReviewForm.css';  

const ReviewForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm(); // Add reset

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });  
      if (response.ok) {
        console.log('Review submitted successfully');
        reset(); // Reset the form after a successful submission
      } else {
        console.error('Error submitting review');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleInput = (event) => {
    event.target.style.height = 'auto'; // Reset the height
    event.target.style.height = `${event.target.scrollHeight}px`; // Adjust to fit content
  };

  return (
    <form className='review-form' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Your Name:</label>
        <input
          type='text'
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className='error-message'>{errors.name.message}</p>}
      </div>
      <div>
        <label>Your Email:</label>
        <input
          type='email'
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <p className='error-message'>{errors.email.message}</p>}
      </div>
      <div className="full-width">
        <label>Review:</label>
        <textarea
          {...register('review', { required: 'Review is required' })}
          onInput={handleInput} // Attach the dynamic resizing function
        ></textarea>
        {errors.review && <p className='error-message'>{errors.review.message}</p>}
      </div>
      <button className='Submit-Review' type='submit'>SUBMIT REVIEW</button>
    </form>
  );
}; 

export default ReviewForm;
