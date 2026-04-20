import { createBrowserRouter } from 'react-router-dom';
import Login from '../feature/auth/pages/Login';
import { Register } from '../feature/auth/pages/Register';
import Dashboard from '../feature/dashboard/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/',
    element: <Login/>, // Default route points to dashboard
  },
]);
