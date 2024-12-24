import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { registerOwner } from '../controllers/authCon';
import './register.css';
function Register() {

  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registrationData = {
      userName,
      email,
      password
    };

    try {
      const response = await registerOwner(registrationData);
      if (response.success === false) {
        window.location.href = "/"; // Redirect to register page if registration fails
      } else {
        window.location.href = "/ownerU"; // Redirect to home page if registration is successful
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className='authentication'>
      <div className='authentication-form'>
        <div className='form-title'>Nice To Meet You</div>
        <form layout='vertical'>
          <div className='input-box-title'>
            Name
          </div>
          <div className='input-box-uep'>
            <input type='text' value={userName} onChange={(e)=>setUsername(e.target.value)} placeholder='Name'/>
          </div>
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
}

export default Register;
