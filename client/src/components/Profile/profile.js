import React, { useEffect, useState } from "react";
import useFetchData from "../../utils/useFetchData";
import "../Profile/profile.css";
import { uploadUserData } from "../../controllers/uploadCon";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [hostel, setHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { data, isLoading, isError } = useFetchData(
    "https://kook-bqcr.onrender.com/getOrders"
  );

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    const updatedProfileData = {
      hostel,
      roomNumber,
      phoneNumber,
    };

    const response = await uploadUserData(updatedProfileData);
    if (response.success === true) {
      console.log("User data updated.");
      setHostel("");
      setRoomNumber("");
      setPhoneNumber("");
    } else {
      console.log("User data update failed.");
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setOrders(data.reverse());
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="container">
      <div className="profile-update-box">
        <div className="profile-update">
          <form className="profile-update-form" onSubmit={handleProfileUpdate}>
            <label>Hostel:</label>
            <input
              type="text"
              name="hostel"
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
            />
            <label>Room Number:</label>
            <input
              type="text"
              name="roomNumber"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button type="submit" className="profile-update-btn">
              Update
            </button>
          </form>
        </div>
      </div>

      <div className="order-history-box">
        <div className="order-history-box-title">Order History</div>
        {orders.map((order) => (
          <div className="order-history-list" key={order._id}>
            <div className="order-items-name">
              <strong>Items:</strong>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div>
                    {item.itemName} x{item.quantity}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-item-total">
              <strong>Total Amount: </strong> ₹{order.amount}
            </div>
            <div className="order-item-delivery">
              <strong>Delivery Address: </strong>
              {order.address || "Not provided"}
            </div>
            <div className="order-item-status">
              <strong>Delivery Status:</strong> {order.delivery}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
