import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function login(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;  
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
}
export async function register({
  email,
  contact,
  fullname,
  password,
  isSeller = false
}) {
  try {
    // Basic validation
    if (!email || !password || !fullname) {
      throw new Error("Required fields missing");
    }

    const response = await api.post("/register", {
      email,
      contact,
      fullname,
      password,
      isSeller
    });

    return response.data;

  } catch (error) {
    // Safe error handling
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
}