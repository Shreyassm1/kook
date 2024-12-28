import React, { useState, useEffect } from "react";
import "./ownerMenu.css";
import { useParams, Link } from "react-router-dom";
import useFetchData from "../../utils/useFetchData";
import { logoutOwner } from "../../controllers/authCon";

const OwnerMenu = () => {
  const [items, setItems] = useState([]);
  const { canteenId } = useParams();

  const {
    data: menuData,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useFetchData(`http://localhost:8000/getMenu/${canteenId}`);

  const {
    data: canteenData,
    isLoading: isCanteenLoading,
    isError: isCanteenError,
  } = useFetchData(`http://localhost:8000/getCanteenName/${canteenId}`);

  useEffect(() => {
    if (menuData && menuData.length > 0) {
      const updatedItems = menuData.map((item) => ({
        ...item,
        itemCount: 0, // Owner doesn't have item count for this view
      }));
      setItems(updatedItems);
    }
  }, [menuData]);

  if (isMenuLoading || isCanteenLoading) {
    return <div>Loading...</div>;
  }

  if (isMenuError || isCanteenError) {
    return <div>Error fetching data.</div>;
  }

  const handleLogOut = () => {
    const res = logoutOwner();
    if (!res) {
      throw new Error("Error logging out");
    }
    window.location.href = "/ownerL";
  };

  return (
    <div className="owner-menu-container">
      <div className="owner-menu-title">{canteenData} - Manage Menu</div>

      <div className="owner-menu-form-container">
        <form className="owner-menu-form">
          <input
            type="text"
            placeholder="Item Name"
            className="owner-menu-form__input"
          />
          <input
            type="text"
            placeholder="Item Description"
            className="owner-menu-form__input"
          />
          <input
            type="number"
            placeholder="Item Price"
            className="owner-menu-form__input"
          />
          <input
            type="file"
            className="owner-menu-form__input"
            accept="image/*"
          />
          <button type="submit">Add Item</button>
        </form>

        <div className="owner-menu-buttons">
          <Link to={`/manage-items/${canteenId}`} className="owner-menu-button">
            Manage Items
          </Link>
          <Link to={`/orders/${canteenId}`} className="owner-menu-button">
            Go to Orders
          </Link>
          <button className="owner-menu-button" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>

      <div className="owner-menu-items-list">
        <h2>Current Items</h2>
        {items.map((item) => (
          <div key={item._id} className="owner-menu-item">
            <img
              src={item.ItemImage}
              alt={item.ItemName}
              className="owner-menu-item-image"
            />
            <div className="owner-menu-item-info">
              <h3>{item.ItemName}</h3>
              <p>{item.ItemDescription}</p>
              <span>₹{item.ItemPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerMenu;
