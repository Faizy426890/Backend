import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [wrongPass, setWrongPass] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('user', JSON.stringify(responseData.username));
        navigate('/Login/AdminPanel');
      } else {
        const errorData = await response.json();
        setWrongPass(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setWrongPass('An error occurred. Please try again.');
    }
  };

  return (
    <section className='login'>
      <div className='login-container'>
        <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
          <p>Sign in</p>
          <input
            type="text"
            placeholder="Username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <p>{errors.username.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p>{errors.password.message}</p>}

          {wrongPass && <p className="error-message">{wrongPass}</p>}

          <button className='login-button' type="submit">Login</button>
        </form>
      </div>
    </section>
  );
};

export default Login;
