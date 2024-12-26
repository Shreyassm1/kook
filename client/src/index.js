import React from "react";
import ReactDOM from "react-dom/client";
// import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CanteenPage from "./pages/CanteenPage";
import AddCanteen from "./pages/addCanteen";
import OwnerReg from "./pages/ownerReg";
import OwnerLogin from "./pages/ownerLog";
import Cart from "./pages/CartPage";
import AddMenu from "./pages/addMenu";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="canteen" element={<CanteenPage />} />
        <Route path="ownerU" element={<AddCanteen />} />
        <Route path="ownerR" element={<OwnerReg />} />
        <Route path="ownerM" element={<AddMenu />} />
        <Route path="ownerL" element={<OwnerLogin />} />
        <Route path="cart" element={<Cart />} />
        <Route path="getMenu/:canteenId" element={<CanteenPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
