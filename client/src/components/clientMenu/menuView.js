import React, { useState, useEffect } from "react";
import "./menu.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [canteenName, setCanteenName] = useState("");
  const { canteenId } = useParams();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // console.log("Fetching items from server...");
        const response = await axios.get(
          `http://localhost:8000/getMenu/${canteenId}`
        );

        const itemsWithCount = response.data.map((item) => ({
          ...item,
          itemCount: 0,
        }));
        setItems(itemsWithCount);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchCanteenName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/getCanteenName/${canteenId}`
        );
        console.log(response.data);
        const canteenName = response.data;
        setCanteenName(canteenName);
      } catch (error) {
        console.error("Error fetching canteen:", error);
      }
    };

    fetchCanteenName();
    fetchItems();
  }, [canteenId]);
  // console.log(items);
  const handleAdd = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item._id === itemId) {
        return { ...item, itemCount: item.itemCount + 1 };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleSub = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item._id === itemId && item.itemCount > 0) {
        return { ...item, itemCount: item.itemCount - 1 };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <div className="max-width">
      <div className="title">{canteenName} - MENU</div>
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
