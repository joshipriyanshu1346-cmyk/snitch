import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../feature/core/layouts/MainLayout';
import Login from '../feature/auth/pages/Login';
import { Register } from '../feature/auth/pages/Register';
import Dashboard from '../feature/product/pages/Dashboard';
import Createproduct from '../feature/product/pages/Createproduct';
import Home from '../feature/home/pages/Home';
import Cart from '../feature/cart/pages/Cart';
import AdminDashboard from '../feature/admin/pages/AdminDashboard';
import SellerproductDetails from '../feature/product/pages/SellerproductDetails';

export const router = createBrowserRouter([
  // Auth pages (no navbar/footer)
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },

  // Admin (own layout)
  {
    path: '/admin',
    element: <AdminDashboard />,
  },

  // Create Product (seller standalone page)
  {
    path: '/create-product',
    element: <Createproduct />,
  },

  // Main layout pages
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/seller-product-details',
        element: <SellerproductDetails/>,
      }

    ],
  },
]);
