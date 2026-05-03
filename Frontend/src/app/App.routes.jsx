import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../feature/core/layouts/MainLayout";
import Login from "../feature/auth/pages/Login";
import { Register } from "../feature/auth/pages/Register";
import Dashboard from "../feature/product/pages/Dashboard";
import UserDashboard from "../feature/product/pages/UserDashboard";
import SellerDashboard from "../feature/product/pages/SellerDashboard";
import Createproduct from "../feature/product/pages/Createproduct";
import Home from "../feature/home/pages/Home";
import Cart from "../feature/cart/pages/Cart";
import AdminDashboard from "../feature/admin/pages/AdminDashboard";
import SellerproductDetails from "../feature/product/pages/SellerproductDetails";
import ProductDetails from "../feature/product/pages/ProductDetails";
import Favorites from "../feature/product/pages/Favorites";
import OrderSuccess from "../feature/order/pages/OrderSuccess";
import SellerOrders from "../feature/order/pages/SellerOrders";

export const router = createBrowserRouter([
  // Auth pages (no navbar/footer)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Admin (own layout)
  {
    path: "/admin",
    element: <AdminDashboard />,
  },

  // Main layout pages
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/user-dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/seller-dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      // Seller specific pages within layout
      {
        path: "/create-product",
        element: <Createproduct />,
      },
      {
        path: "/seller-product-details",
        element: <SellerproductDetails />,
      },
      {
        path: "/order/success/:id",
        element: <OrderSuccess />,
      },
      {
        path: "/seller/orders",
        element: <SellerOrders />,
      },
    ],
  },
]);

