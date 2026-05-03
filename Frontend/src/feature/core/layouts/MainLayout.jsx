import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserNavbar from '../components/UserNavbar';
import SellerNavbar from '../components/SellerNavbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  
  const isSeller = user?.role === 'seller';

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] text-gray-900 dark:text-white transition-colors">
      {isSeller ? <SellerNavbar /> : <UserNavbar />}
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MainLayout;

