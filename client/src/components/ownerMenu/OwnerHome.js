import React, { useState, useEffect } from "react";
import useFetchData from "../../utils/useFetchData";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import axios from "axios";

import "@fortawesome/fontawesome-free/css/all.min.css";
// import "./OwnerHome.css";
const OwnerHome = () => {
  const { canteenId } = useParams();
  const [items, setItems] = useState([]);
  const [ItemName, setItemName] = useState("");
  const [ItemPrice, setItemPrice] = useState("");
  const [ItemDescription, setItemDescription] = useState("");
  const [ItemImage, setItemImage] = useState("");
  const {
    data: canteenData,
    isLoading: isCanteenLoading,
    isError: isCanteenError,
  } = useFetchData(
    `https://kook-bqcr.onrender.com/getCanteenName/${canteenId}`
  );
  const {
    data: menuData,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useFetchData(`https://kook-bqcr.onrender.com/getMenu/${canteenId}`);

  useEffect(() => {
    if (menuData && menuData.length > 0) {
      const listedItems = menuData.map((item) => ({
        ...item,
      }));
      setItems(listedItems);
    }
  }, [menuData]);
  console.log(items);

  if (isMenuLoading || isCanteenLoading) {
    return <div>Loading...</div>;
  }

  if (isMenuError || isCanteenError) {
    return <div>Error fetching data.</div>;
  }

  const updateItemPopUp = () => {};
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
  // const handleLogOut = () => {
  //   const res = logoutOwner();
  //   if (!res) {
  //     throw new Error("Error logging out");
  //   }
  //   window.location.href = "/ownerL";
  // };
  const handleSubmit = async (event) => {
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
        `https://kook-bqcr.onrender.com/menuUpload/${canteenId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Menu data submitted successfully:", response.data);

      // Reset form fields
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemImage("");
    } catch (error) {
      console.error("Error submitting canteen data:", error);
    }
  };

  return (
    <div className="owner-home-main">
      <div className="owner-home-header">
        <div className="canteeen-name-owner-home">{canteenData}</div>
        <div className="add-item-btn">
          <Popup trigger={<button> Click to open modal </button>} modal nested>
            {(close) => (
              <div className="add-item-window">
                Update Item
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
                    onClick={handleSubmit}
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
        <div className="owner-logout-btn">
          <i className="fa-solid fa-sign-out">Logout</i>
        </div>
      </div>
      <div className="owner-home-body">
        <div className="owner-menu-update-container">
          Menu Items
          <div className="owner-menu-items-box">
            {items.map((item) => (
              <div className="owner-menu-item">
                <img
                  src={item.ItemImage}
                  alt={item.ItemName}
                  className="owner-menu-item-image"
                />
                <div className="item-name">{item.ItemName}</div>
                <div className="item-price">{item.ItemPrice}</div>
                <div className="owner-delete-item">
                  <i className="fa-solid fa-trash"></i>
                </div>
                <div
                  className="owner-update-item-info"
                  onClick={updateItemPopUp}
                >
                  Update Item
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="owner-profile-update-container">
          Update Canteen Info Here
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
