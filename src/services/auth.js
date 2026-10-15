import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/users";

// register api
export const registerUser = (data) => {
  return axios
    .post(`${API_URL}/signup`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data?.message || "Server error";
    });
};

// logon api
export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}/signin`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      token: data?.data?.token,
      user: data?.data?.user,
      message: data?.message,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
