import React, { useState } from "react";
import axios from "axios";
import "./ownerPage.css";
import { logoutOwner } from "../../controllers/authCon";
const BASE_URLS = process.env.REACT_APP_BASE_URL_S;
const BASE_URLC = process.env.REACT_APP_BASE_URL_C;
const OwnerPage = () => {
  const [canteenName, setCanteenName] = useState("");
  const [canteenDescription, setCanteenDescription] = useState("");
  const [canteenLocation, setCanteenLocation] = useState("");
  const [canteenImage, setCanteenImage] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const cloudName = "dh4hs9xvf";
    const uploadPreset = "ml_default1";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      setCanteenImage(response.data.secure_url);
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      canteenName,
      canteenDescription,
      canteenLocation,
      canteenImage,
    };

    try {
      const response = await axios.post(`${BASE_URLS}/ownerPost`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Canteen data submitted successfully:", response.data);
      window.location.href = `${BASE_URLC}/ownerM`;

      // Reset form fields
      setCanteenName("");
      setCanteenDescription("");
      setCanteenLocation("");
      setCanteenImage("");
    } catch (error) {
      console.error("Error submitting canteen data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const response = await logoutOwner();
      if (!response.success) {
        throw new Error("Failed to log out");
      }
      window.location.href = `${BASE_URLC}/login`;
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error: Unable to log out. Please try again later.");
    }
  };

  return (
    <div className="ownerPage__container">
      <form className="ownerPage__form" onSubmit={handleSubmit}>
        <div className="ownerPage__form__input">
          <input
            type="text"
            placeholder="Enter Canteen Name"
            value={canteenName}
            onChange={(e) => setCanteenName(e.target.value)}
            required
          />
        </div>
        <div className="ownerPage__form__input">
          <input
            type="text"
            placeholder="Enter Canteen Description"
            value={canteenDescription}
            onChange={(e) => setCanteenDescription(e.target.value)}
            required
          />
        </div>
        <div className="ownerPage__form__input">
          <input
            type="text"
            placeholder="Enter Canteen Location"
            value={canteenLocation}
            onChange={(e) => setCanteenLocation(e.target.value)}
            required
          />
        </div>
        <div className="ownerPage__form__input">
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            required
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </form>
    </div>
  );
};

export default OwnerPage;
