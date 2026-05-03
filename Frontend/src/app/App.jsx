import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './App.routes'
import { useAuth } from '../feature/auth/hook/useAuth'
import './App.css'

function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  
  }, []);

  return <RouterProvider router={router} />
}

export default App
