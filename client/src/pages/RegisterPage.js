import { Link } from "react-router-dom";
import React, { useState } from "react";
import { registerUser } from "../controllers/authCon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./register.css";
const BASE_URLS = process.env.REACT_APP_BASE_URL_S;

function Register() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleAuth = async (e) => {
    e.preventDefault();

    // Redirect user to OAuth2 authentication route on backend
    window.location.href = `${BASE_URLS}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registrationData = {
      userName,
      email,
      password,
    };

    try {
      const response = await registerUser(registrationData);
      if (response.success === false) {
        window.location.href = "/"; // Redirect to reg page if registration fails
      } else {
        window.location.href = "/login"; // Redirect to home page if registration is successful
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  return (
    <div className="authentication">
      <div className="authentication-form">
        <div className="form-title">Nice To Meet You</div>
        <form layout="vertical">
          <div className="input-box-title">Name</div>
          <div className="input-box-uep">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="input-box-title">E-mail</div>
          <div className="input-box-uep">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="xyz@email.com"
            />
          </div>
          <div className="input-box-title">Password</div>
          <div className="input-box-uep">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          <button
            className="primary-button"
            type="submit"
            onClick={handleSubmit}
          >
            REGISTER
          </button>
          <div className="google-btn">
            <button type="submit" onClick={googleAuth}>
              <FontAwesomeIcon icon={faGoogle} /> Sign up with Google
            </button>
          </div>
          <div className="links">
            <Link to="/login" className="anchor">
              Already have an account?
            </Link>
          </div>
          <div className="links">
            <Link to="/ownerR" className="anchor">
              Click here if you are an owner.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
