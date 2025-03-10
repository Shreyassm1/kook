import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = process.env.REACT_APP_BASE_URL_S;

export const uploadOrder = async (orderInfo) => {
  console.log("order: ", orderInfo);
  try {
    const response = await axios.post(`${BASE_URL}/uploadOrder`, orderInfo);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error("Order already exists:", error.response.data.error);
      return { success: false, error: error.response.data.error };
    } else {
      console.error("Error while ordering:", error);
      return { success: false, error: "Order failed" };
    }
  }
};

export const uploadUserData = async (updatedProfileData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/updateAddress`,
      updatedProfileData
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while updating user data: ", error);
    return { success: false, error: "User Update failed" };
  }
};
