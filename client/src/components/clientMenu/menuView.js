import React, { useState, useEffect } from "react";
import "./menu.css";
import { useParams } from "react-router-dom";
import useFetchData from "../../utils/useFetchData";
const Menu = () => {
  const [items, setItems] = useState([]);
  const { canteenId } = useParams();

  // Fetch menu items
  const {
    data: menuData,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useFetchData(`http://localhost:8000/getMenu/${canteenId}`);

  // Fetch canteen name
  const {
    data: canteenData,
    isLoading: isCanteenLoading,
    isError: isCanteenError,
  } = useFetchData(`http://localhost:8000/getCanteenName/${canteenId}`);

  // Initialize items with itemCount
  useEffect(() => {
    if (menuData && menuData.length > 0) {
      const updatedItems = menuData.map((item) => ({
        ...item,
        itemCount: 0,
      }));
      setItems(updatedItems);
    }
  }, [menuData]);

  // Handle loading and error states
  if (isMenuLoading || isCanteenLoading) {
    return <div>Loading...</div>;
  }

  if (isMenuError || isCanteenError) {
    return <div>Error fetching data.</div>;
  }

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
