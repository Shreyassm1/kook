import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = process.env.REACT_APP_BASE_URL_S;

export const handleStatus = async (requestData) => {
  console.log(requestData);
  try {
    const response = await axios.post(`${BASE_URL}/updateStatus`, requestData);

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while updating status:", error);
    return { success: false, error: "Status Update failed" };
  }
};
