import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import store from "./redux/store"; // Import your Redux store
import reportWebVitals from "./reportWebVitals";

// Import Pages
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
    <Provider store={store}>
      {" "}
      {/* Wrap the entire app with Redux Provider */}
      <BrowserRouter>
        <Routes>
          {/* Common routes */}
          <Route path="" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="ownerL" element={<OwnerLogin />} />
          <Route path="ownerR" element={<OwnerReg />} />
          {/* Student routes */}
          <Route path="home" element={<HomePage />} />
          <Route path="canteen" element={<CanteenPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="getMenu/:canteenId" element={<CanteenPage />} />
          {/* Owner routes */}
          <Route path="ownerU" element={<AddCanteen />} />
          {/* <Route path="ownerM" element={<AddMenu />} /> */}
          <Route path="menuUpload/:canteenId" element={<AddMenu />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
