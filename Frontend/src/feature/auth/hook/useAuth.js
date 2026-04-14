import { setError,setLoading,setUser } from "../state/auth.slice";
import { login , register  } from "../services/auth.api";
import { useDispatch } from "react-redux";


export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({email,password,contact,fullname,isSeller=false}){
    const data= await register({email,password,contact,fullname,isSeller})
    
    dispatch(setUser(data.user))
    

  }

  async function handleLogin({email,password}){
    const data=await login({email,password})
    dispatch(setUser(data.user))
  }

  return {handleLogin,handleRegister} 
}