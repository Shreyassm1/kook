import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { loginUser } from '../controllers/authCon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './register.css';
function Register() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleAuth = async (e) => {
    e.preventDefault();

    // Redirect user to OAuth2 authentication route on backend
    window.location.href = "http://localhost:8000/auth/google";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registrationData = {
      email,
      password
    };

    try {
      const response = await loginUser(registrationData);
      if (response.success === false) {
        window.location.href = "/"; // Redirect to home page if registration fails
      } else {
        window.location.href = "/home"; // Redirect to home page if registration is successful
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };


  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  return (
    <div className='authentication'>
      <div className='authentication-form'>
        <div className='form-title'>Welcome Back</div>
        <form layout='vertical' onSubmit={onFinish}>
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
          <button className='primary-button' type='submit' onClick={handleSubmit}>Login</button>
          <div className='google-btn'>
            <button type='submit' onClick={googleAuth}>
              <FontAwesomeIcon icon={faGoogle} /> Login with Google
            </button>
          </div>
          <div className='links'>
            <Link to='/' className='anchor'>Don't have an account? </Link>
          </div>
          <div className='links'>
          <Link to='/ownerR' className='anchor'>Click here if you are an owner.</Link>
          </div>
        </form>
      </div>

    </div>
  );
}

export default Register;
