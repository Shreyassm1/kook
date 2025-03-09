import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./cart.css";
import { uploadOrder } from "../../controllers/uploadCon";
import { clearCart } from "../../redux/actions/cartActions";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [isPopupVisible, setPopupVisible] = useState(false);

  if (!cartItems || Object.keys(cartItems).length === 0) {
    return (
      <div className="empty-cart-message">
        Your cart is empty. <a href="/home">Browse Items</a>
      </div>
    );
  }

  const totalAmount = Object.keys(cartItems).reduce((total, itemId) => {
    return total + cartItems[itemId].ItemPrice * cartItems[itemId].itemCount;
  }, 0);

  const handlePay = () => {
    setPopupVisible(true);
    const orderInfo = {
      cartItems,
      amount: totalAmount,
    };
    console.log(orderInfo);
    const response = uploadOrder(orderInfo);
    if (response.success !== false) {
      console.log("Order Failed");
    } else {
      console.log(orderInfo);
    }
  };

  const handleClosePopup = () => {
    dispatch(clearCart());
    setPopupVisible(false);
  };

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2 className="cart-header">Your Cart</h2>
        <ul className="cart-item-list">
          {Object.keys(cartItems).map((itemId) => (
            <li key={itemId} className="cart-item">
              <img
                src={cartItems[itemId].ItemImage}
                alt={cartItems[itemId].ItemName}
                className="cart-item-image"
              />
              <div>
                <div className="cart-item-name">
                  {cartItems[itemId].ItemName}
                </div>

                <div className="cart-item-price">
                  ₹{cartItems[itemId].ItemPrice} x {cartItems[itemId].itemCount}
                </div>
              </div>

              <div className="cart-item-total">
                ₹{cartItems[itemId].ItemPrice * cartItems[itemId].itemCount}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="payment-summary-container">
        <h3 className="payment-header">Payment</h3>
        <div className="payment-summary">
          <div className="payment-summary-item">
            <span>Subtotal:</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="payment-summary-item">
            <span>Delivery:</span>
            <span>₹10</span>
          </div>
          <div className="payment-summary-item">
            <span>Total:</span>
            <span>₹{totalAmount + 10}</span>
          </div>
        </div>
        <button className="payment-button" onClick={handlePay}>
          Proceed to Checkout
        </button>
      </div>

      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Order Placed</h3>
            <p>Thank you for shopping with us!</p>
            <p>Your total is ₹{totalAmount + 10}.</p>
            <button className="close-popup-button" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
