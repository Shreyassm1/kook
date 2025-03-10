import axios from "axios";
axios.defaults.withCredentials = true;
const BASE_URL = process.env.REACT_APP_BASE_URL_S;

export const deleteItem = async (itemId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteItem/${itemId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while deleting item:", error);
    return { success: false, error: "Deletion failed" };
  }
};

export const updateItem = async (updatedItemInfo) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/updateItem`,
      updatedItemInfo
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while updating item data: ", error);
    return { success: false, error: "Item Update failed" };
  }
};
