import React, { useState, useEffect } from "react";
import useFetchData from "../../utils/useFetchData";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import axios from "axios";
import { logoutOwner } from "../../controllers/authCon";
import { deleteItem } from "../../controllers/ownerCon";
import { handleStatus } from "../../controllers/statusCon";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./OwnerHome.css";
const BASE_URLS = process.env.REACT_APP_BASE_URL_S;

const OwnerHome = () => {
  const { canteenId } = useParams();
  const [items, setItems] = useState([]);
  const [ItemName, setItemName] = useState("");
  const [ItemPrice, setItemPrice] = useState("");
  const [ItemDescription, setItemDescription] = useState("");
  const [ItemImage, setItemImage] = useState("");
  const [orders, setOrders] = useState([]);
  const {
    data: canteenData,
    isLoading: isCanteenLoading,
    isError: isCanteenError,
  } = useFetchData(`${BASE_URLS}/getCanteenName/${canteenId}`);
  const {
    data: menuData,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useFetchData(`${BASE_URLS}/getMenu/${canteenId}`);
  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useFetchData(`${BASE_URLS}/getOrdersOwners`);

  useEffect(() => {
    if (menuData && menuData.length > 0) {
      const listedItems = menuData.map((item) => ({
        ...item,
      }));
      setItems(listedItems);
    }
  }, [menuData]);

  useEffect(() => {
    if (orderData && orderData.length > 0) {
      const listedItems = orderData.filter(
        (order) => order.status !== "Rejected" && order.status !== "Delivered"
      );
      setOrders(listedItems);
    }
  }, [orderData]);

  if (isMenuLoading || isCanteenLoading || isOrderLoading) {
    return <div>Loading...</div>;
  }

  if (isMenuError || isCanteenError || isOrderError) {
    return <div>Error fetching data.</div>;
  }
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const cloudName = "dh4hs9xvf";
    const uploadPreset = "ml_default1";
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { withCredentials: false }
      );

      setItemImage(response.data.secure_url);
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleLogOut = () => {
    const res = logoutOwner();
    if (!res) {
      throw new Error("Error logging out");
    }
    window.location.href = "/ownerL";
  };
  const handleDeleteItem = async (itemId) => {
    const res = await deleteItem(itemId);
    if (!res) {
      throw new Error("Error deleting item");
    }
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };
  // const handleUpdateItem = async (event, itemId) => {
  //   event.preventDefault();
  //   const itemInfo = {
  //     itemId,
  //     ItemPrice,
  //     ItemDescription,
  //     ItemImage,
  //   };
  //   try {
  //     const response = await updateItem(itemInfo);
  //     if (!response.success) {
  //       console.error("Error updating item data:", response.error);
  //       return;
  //     }
  //     console.log("Updated successfully:", response.data);
  //     setItems((prevItems) =>
  //       prevItems.map((item) =>
  //         item._id === itemId ? { ...item, ...itemInfo } : item
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error submitting canteen data:", error);
  //   }
  // };
  const handleAddItem = async (event) => {
    event.preventDefault();

    const requestData = {
      canteenId,
      ItemName,
      ItemPrice,
      ItemDescription,
      ItemImage,
    };

    try {
      const response = await axios.post(
        `${BASE_URLS}/menuUpload/${canteenId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Menu data submitted successfully:", response.data);

      window.location.reload();

      setItemName("");
      setItemPrice("");
      setItemDescription("");
      setItemImage("");
    } catch (error) {
      console.error("Error submitting canteen data:", error);
    }
  };

  const handleStatusOrder = async (orderId, check) => {
    const requestData = { orderId, check };
    try {
      const res = await handleStatus(requestData);

      if (!res.success) {
        throw new Error("Error updating order status");
      }

      setOrders((prevOrders) =>
        prevOrders
          .map((order) =>
            order._id === orderId
              ? { ...order, status: res.data.updatedOrder.status }
              : order
          )
          .filter(
            (order) =>
              order.status !== "Rejected" && order.status !== "Delivered"
          )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="owner-home-main">
      <div className="owner-home-header">
        <div className="canteeen-name-owner-home">{canteenData}</div>

        <div className="owner-logout-btn">
          <i className="fa-solid fa-sign-out" onClick={handleLogOut}>
            Logout
          </i>
        </div>
      </div>
      <div className="owner-home-body">
        <div className="owner-menu-update-container">
          Menu Items
          <div className="owner-menu-items-box">
            {items.map((item) => (
              <div key={item._id} className="owner-menu-item">
                <img
                  src={item.ItemImage}
                  alt={item.ItemName}
                  className="owner-menu-item-image"
                />
                <div className="owner-menu-item-info">
                  <div className="owner-menu-item-name">{item.ItemName}</div>
                  <div className="owner-menu-item-description">
                    {item.ItemDescription}
                  </div>
                  <div className="owner-menu-item-price">₹{item.ItemPrice}</div>
                </div>
                <div className="owner-delete-item">
                  <i
                    className="fa-solid fa-trash"
                    onClick={() => handleDeleteItem(item._id)}
                  ></i>
                </div>
                {/* <div className="owner-update-item-info">
                  <Popup trigger={<div>Update Item</div>} modal nested>
                    {(close) => (
                      <div className="update-item-window">
                        Update Item
                        <form>
                          <div className="update-item-price">
                            <input
                              type="text"
                              placeholder="Enter Item Price"
                              value={ItemPrice}
                              onChange={(e) => setItemPrice(e.target.value)}
                            />
                          </div>
                          <div className="update-item-description">
                            <input
                              type="text"
                              placeholder="Enter Item Description"
                              value={ItemDescription}
                              onChange={(e) =>
                                setItemDescription(e.target.value)
                              }
                            />
                          </div>
                          <div className="update-item-image">
                            <input
                              type="file"
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                          </div>
                          <button
                            className="submit-update-item-btn"
                            onClick={(e) => handleUpdateItem(e, item._id)}
                          >
                            Update Item
                          </button>
                        </form>
                        <div>
                          <button onClick={() => close()}>Close</button>
                        </div>
                      </div>
                    )}
                  </Popup>
                </div> */}
              </div>
            ))}
          </div>
        </div>
        <div className="owner-profile-update-container">
          <div className="owner-update-info">Update Canteen Info</div>
          <div className="add-item-btn">
            <Popup trigger={<button> Add Item </button>} modal nested>
              {(close) => (
                <div className="add-item-window">
                  Add Item
                  <form>
                    <div className="add-item-name">
                      <input
                        type="text"
                        placeholder="Enter Item Name"
                        value={ItemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="add-item-price">
                      <input
                        type="text"
                        placeholder="Enter Item Price"
                        value={ItemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="add-item-description">
                      <input
                        type="text"
                        placeholder="Enter Item Description"
                        value={ItemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="add-item-image">
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        required
                      />
                    </div>
                    <button
                      className="submit-add-item-btn"
                      onClick={handleAddItem}
                    >
                      Add Item
                    </button>
                  </form>
                  <div>
                    <button onClick={() => close()}>Close</button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <div className="owner-active-order-list">
            Orders:
            {orders.map((order) => (
              <div className="order-item-box">
                <div className="ordered-item">
                  {order.items.map((item) => (
                    <div>
                      {item.itemName} x{item.quantity}
                    </div>
                  ))}
                </div>
                <div className="order-address">Address: {order.address}</div>
                <div className="order-total">Total: ₹{order.amount}</div>
                <div className="order-status">Order Status: {order.status}</div>
                <div className="accept-reject-order">
                  {order.status === "pending" && (
                    <>
                      <button
                        className="accept-order"
                        onClick={() => handleStatusOrder(order._id, 1)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-order"
                        onClick={() => handleStatusOrder(order._id, 0)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.status === "Accepted" && (
                    <button
                      className="deliver-order"
                      onClick={() => handleStatusOrder(order._id, 2)}
                    >
                      Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
