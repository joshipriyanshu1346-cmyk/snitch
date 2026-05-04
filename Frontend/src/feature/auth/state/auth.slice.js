import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const savedUser = localStorage.getItem("authUser");
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Persist to localStorage
      if (action.payload) {
        localStorage.setItem("authUser", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("authUser");
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("authUser");
    },
  },
});

export const { setError, setLoading, setUser, logout } = authSlice.actions;
export default authSlice.reducer;