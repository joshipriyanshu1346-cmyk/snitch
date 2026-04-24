import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] text-gray-900 dark:text-white transition-colors">
      <Navbar />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MainLayout;
