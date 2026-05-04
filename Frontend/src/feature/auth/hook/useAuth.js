import { setError, setLoading, setUser, logout } from "../state/auth.slice";
import { login, register, getMe } from "../services/auth.api";
import { useDispatch } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, password, contact, fullname, isSeller = false }) {
    try {
      const data = await register({ email, password, contact, fullname, isSeller });
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      dispatch(setError(error.message || "Registration failed"));
      throw error;
    }
  }

  async function handleLogin({ email, password }) {
    try {
      const data = await login(email, password);
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      dispatch(setError(error.message || "Login failed"));
      throw error;
    }
  }

  async function handleGetMe() {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      // Clear auth on failure
      dispatch(setUser(null));
      dispatch(setError(error.message || "Failed to fetch user data"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleLogout() {
    dispatch(logout());
  }

  return { handleLogin, handleRegister, handleGetMe, handleLogout };
}