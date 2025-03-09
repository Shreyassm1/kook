import React, { useState } from "react";
import "./register.css";
import { loginOwner } from "../controllers/authCon";

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await loginOwner(userData);
      console.log("Login response:", response);
      if (!response.success) {
        throw new Error("Failed to login");
      }

      const hasCanteen = response.data.hasCanteen;
      const canteenId = response.data.canteenId;

      if (hasCanteen) {
        window.location.href = `https://kook-six.vercel.app/menuUpload/${canteenId}`;
      } else {
        window.location.href = "https://kook-six.vercel.app/ownerU";
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form">
        <div className="form-title">Welcome Back</div>
        <form layout="vertical">
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
            Login
          </button>
          <div className="links">
            <a href="/ownerR" className="anchor">
              Don't have an account?
            </a>
          </div>
          <div className="links">
            <a href="/" className="anchor">
              Click here if you are a student.
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
