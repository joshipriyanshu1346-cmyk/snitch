import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const api = axios.create({
  baseURL: `${API_BASE}/api/auth`,
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

export async function getMe(){
  try {
    const response = await api.get("/getMe");
    return response.data;
  }
  catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    else if (error.message) {
      throw new Error(error.message);
    }
    else {
      throw new Error("Something went wrong");
    }
  }
}

export async function updateProfile(data) {
  try {
    const response = await api.put("/update", data);
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

export async function toggleFavorite(productId) {
  try {
    const response = await api.post("/favorites/toggle", { productId });
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

export async function getFavorites() {
  try {
    const response = await api.get("/favorites");
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

