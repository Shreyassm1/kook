import React, { useState, useEffect } from "react";
import "./menu.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import useFetchData from "../../utils/useFetchData";
import {
  addToCart,
  removeFromCart,
  incrementItem,
  decrementItem,
} from "../../redux/actions/cartActions";
const BASE_URLS = process.env.REACT_APP_BASE_URL_S;
// const BASE_URLC = "https://kook-six.vercel.app";
const Menu = () => {
  const [items, setItems] = useState([]);
  const { canteenId } = useParams();
  const dispatch = useDispatch();

  // Redux cart state
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Fetch menu and canteen data
  const {
    data: menuData,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useFetchData(`${BASE_URLS}/getMenu/${canteenId}`);

  const {
    data: canteenData,
    isLoading: isCanteenLoading,
    isError: isCanteenError,
  } = useFetchData(`${BASE_URLS}/getCanteenName/${canteenId}`);

  // Effect to update items with itemCount and cart data
  useEffect(() => {
    // Map menu data with itemCount from the Redux cartItems
    const newData = menuData.map((item) => ({
      ...item,
      itemCount: cartItems[item._id] ? cartItems[item._id].itemCount : 0,
    }));
    setItems(newData);
  }, [menuData, cartItems]);

  // Handle loading or error states
  if (isMenuLoading || isCanteenLoading) {
    return <div>Loading...</div>;
  }

  if (isMenuError || isCanteenError) {
    return <div>Error fetching data.</div>;
  }

  // Handle adding item to cart
  const handleAdd = (itemId) => {
    const newItem = items.find((item) => item._id === itemId);
    const updatedItem = { ...newItem, canteenId };
    console.log(updatedItem);
    if (!updatedItem) return; // If item doesn't exist, do nothing

    if (updatedItem.itemCount === 0) {
      // If item is not in the cart yet, add it
      dispatch(addToCart(updatedItem)); // Dispatch action with the whole item
    } else {
      // If item is already in the cart, increment its count
      dispatch(incrementItem(updatedItem)); // Dispatch increment action with the whole item
    }
  };

  // Handle subtracting item from cart
  const handleSub = (itemId) => {
    const newItem = items.find((item) => item._id === itemId);
    const updatedItem = { ...newItem, canteenId };
    if (!updatedItem || updatedItem.itemCount === 0) return; // Do nothing if count is 0

    if (updatedItem.itemCount === 1) {
      // If count is 1, remove the item from the cart
      dispatch(removeFromCart(itemId)); // Dispatch remove action with itemId
    } else {
      // Otherwise, decrement the count
      dispatch(decrementItem(updatedItem)); // Dispatch decrement action with the whole item
    }
  };

  return (
    <div className="max-width">
      <div className="title">{canteenData} - Menu</div>
      <div className="item-collections">
        {items.map((item) => (
          <div className="item-cards" key={item._id}>
            <div className="name-img-box">
              <img
                src={item.ItemImage}
                alt={item.ItemName}
                className="item-image"
              />
              <div className="item-name">{item.ItemName}</div>
            </div>
            <div className="info-box">
              <div className="item-description">{item.ItemDescription}</div>
              <div className="item-price">₹{item.ItemPrice}</div>
            </div>
            {item.itemCount === 0 ? (
              <div className="add-btn" onClick={() => handleAdd(item._id)}>
                <div className="add-btn-text">
                  <p>ADD</p>
                </div>
              </div>
            ) : (
              <div className="add-btn">
                <div className="add-btn-box">
                  <div className="add-sub" onClick={() => handleSub(item._id)}>
                    -
                  </div>
                  <div className="item-count">{item.itemCount}</div>
                  <div className="add-sub" onClick={() => handleAdd(item._id)}>
                    +
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
