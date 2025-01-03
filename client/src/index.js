import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
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
import ProfilePage from "./pages/ProfilePage";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {" "}
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
            <Route path="/profile" element={<ProfilePage />} />
            {/* Owner routes */}
            <Route path="ownerU" element={<AddCanteen />} />
            <Route path="menuUpload/:canteenId" element={<AddMenu />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
