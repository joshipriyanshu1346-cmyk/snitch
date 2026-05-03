import { setError, setLoading, setUser } from "../state/auth.slice";
import { login, register, getMe } from "../services/auth.api";
import { useDispatch } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({email,password,contact,fullname,isSeller=false}){
    const data= await register({email,password,contact,fullname,isSeller})
        dispatch(setUser(data.user))
      }

  async function handleLogin({email,password}){
    const data=await login(email,password)
    dispatch(setUser(data.user))
    
    }

  async function handleGetMe() {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setUser(null));
      dispatch(setError(error.message || "Failed to fetch user data"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleLogin, handleRegister, handleGetMe };
}