import React, { useState, useEffect } from "react";
import useFetchData from "../../utils/useFetchData";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import axios from "axios";

import "@fortawesome/fontawesome-free/css/all.min.css";

const OwnerHome = () => {
  const { canteenId } = useParams();
  const [items, setItems] = useState([]);
  const [ItemName, setItemName] = useState("");
  const [ItemPrice, setItemPrice] = useState("");
  const [ItemDescription, setItemDescription] = useState("");
  const [ItemImage, setItemImage] = useState("");
  const [uploading, setUploading] = useState(false); // Track upload state

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
      setItems(menuData);
    }
  }, [menuData]);

  if (isMenuLoading || isCanteenLoading) return <div>Loading...</div>;
  if (isMenuError || isCanteenError) return <div>Error fetching data.</div>;

  const updateItemPopUp = () => {};

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return alert("No file selected!");
    if (!file.type.startsWith("image/"))
      return alert("Please upload an image file.");
    if (file.size > 10 * 1024 * 1024)
      return alert("File size must be under 10MB.");

    const cloudName = "dh4hs9xvf";
    const uploadPreset = "ml_default1";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setItemImage(response.data.secure_url);
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ItemName || !ItemPrice || !ItemDescription || !ItemImage) {
      return alert("Please fill in all fields before submitting.");
    }

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

      console.log("Menu item added successfully:", response.data);

      setItemName("");
      setItemPrice("");
      setItemDescription("");
      setItemImage(""); // Reset the image URL
    } catch (error) {
      console.error(
        "Error adding menu item:",
        error.response?.data || error.message
      );
      alert("Failed to add menu item. Please try again.");
    }
  };

  return (
    <div className="owner-home-main">
      <div className="owner-home-header">
        <div className="canteeen-name-owner-home">{canteenData}</div>
        <div className="add-item-btn">
          <Popup trigger={<button>Click to open modal</button>} modal nested>
            {(close) => (
              <div className="add-item-window">
                <h2>Add Item</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Enter Item Name"
                    value={ItemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Enter Item Price"
                    value={ItemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Enter Item Description"
                    value={ItemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    required
                  />
                  {uploading && <p>Uploading image...</p>}
                  <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Add Item"}
                  </button>
                </form>
                <button onClick={close}>Close</button>
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
          <h3>Menu Items</h3>
          <div className="owner-menu-items-box">
            {items.map((item) => (
              <div key={item._id} className="owner-menu-item">
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
          <h3>Update Canteen Info Here</h3>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
