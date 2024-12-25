import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './register.css';

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password
    };

    try {
      const response = await fetch("http://localhost:8000/loginOwner", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      const token = data.token;
      console.log("JWT Token:", token);
      localStorage.setItem('token', token);

      window.location.href = "http://localhost:3000/ownerU";
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className='authentication'>
      <div className='authentication-form'>
        <div className='form-title'>Nice To Meet You</div>
        <form layout='vertical'>
          <div className='input-box-title'>
            E-mail
          </div>
          <div className='input-box-uep'>
            <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='xyz@email.com'/>
          </div>
          <div className='input-box-title'>
            Password
          </div>
          <div className='input-box-uep'>
            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='password'/>
          </div>
          <button className='primary-button' type='submit' onClick={handleSubmit}>REGISTER</button>
          <div className='links'>
            <Link to='/ownerL' className='anchor'>Already have an account?</Link>
          </div>
          <div className='links'>
          <Link to='/' className='anchor'>Click here if you are a student.</Link>
          </div>
        </form>
      </div>

    </div>
  );
};

export default OwnerLogin;
