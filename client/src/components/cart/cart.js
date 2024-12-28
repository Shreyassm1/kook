import React from "react";
import { useSelector } from "react-redux";
import "./cart.css";

const Cart = () => {
  // Access the cartItems state from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Log the cartItems for debugging
  console.log("Cart items from Redux:", cartItems);

  // If the cart is empty, show a message
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

  // Display the cart items
  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2 className="cart-header">Your Cart</h2>
        <ul className="cart-item-list">
          {Object.keys(cartItems).map((itemId) => (
            <li key={itemId} className="cart-item">
              {/* Item Image */}
              <img
                src={cartItems[itemId].ItemImage}
                alt={cartItems[itemId].ItemName}
                className="cart-item-image"
              />
              <div>
                {/* Item Name */}
                <div className="cart-item-name">
                  {cartItems[itemId].ItemName}
                </div>
                {/* Item Price and Quantity */}
                <div className="cart-item-price">
                  ₹{cartItems[itemId].ItemPrice} x {cartItems[itemId].itemCount}
                </div>
              </div>
              {/* Item Total */}
              <div className="cart-item-total">
                ₹{cartItems[itemId].ItemPrice * cartItems[itemId].itemCount}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Container */}
      <div className="payment-summary-container">
        <h3 className="payment-header">Payment</h3>
        <div className="payment-summary">
          <div className="payment-summary-item">
            <span>Subtotal:</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="payment-summary-item">
            <span>Delivery:</span>
            <span>₹10</span> {/* Placeholder for delivery fee */}
          </div>
          <div className="payment-summary-item">
            <span>Total:</span>
            <span>₹{totalAmount + 10}</span>
          </div>
        </div>
        <button className="payment-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
