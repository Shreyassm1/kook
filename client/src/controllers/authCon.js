import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:8000";

export const registerUser = async (registrationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, registrationData);

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error("User already exists:", error.response.data.error);
      return { success: false, error: error.response.data.error };
    } else {
      console.error("Error during user registration:", error);
      return { success: false, error: "Registration failed" };
    }
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, loginData);

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error during user Login:", error);
    return { success: false, error: "Login failed" };
  }
};

export const registerOwner = async (registrationData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/registerOwner`,
      registrationData
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // User already exists
      console.error("User already exists:", error.response.data.error);
      return { success: false, error: error.response.data.error };
    } else {
      // Other errors
      console.error("Error during user registration:", error);
      return { success: false, error: "Registration failed" };
    }
  }
};

export const logoutUser = async () => {
  try {
    console.log("Logging out...");
    const response = await axios.post(`${BASE_URL}/logout`, {});
    console.log("Logout response:", response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
};

export const loginOwner = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/loginOwner`, loginData);
    console.log("loginOwner response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("loginOwner error:", error);
    return { success: false, error: "login failed." };
  }
};

export const logoutOwner = async () => {
  console.log("logoutOwner");
  try {
    const response = await axios.post(`${BASE_URL}/logoutOwner`, {});
    console.log(response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("logoutOwner error:", error);
    return { success: false, error: "logout failed." };
  }
};

export const refreshOwnerToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/refreshTokenOwner`, {});
    return { success: true, data: response.data };
  } catch (error) {
    console.error("refreshOwnerToken error:", error);
    return { success: false, error: "refresh token failed." };
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL}/refresh-token`, {});
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("refreshAccessToken error:", error);
    return {
      success: false,
      error: "refresh accessToken failed.",
    };
  }
};
