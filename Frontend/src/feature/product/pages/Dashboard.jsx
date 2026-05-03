import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import SellerDashboard from './SellerDashboard';

export const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return user.role === 'seller' ? <SellerDashboard /> : <UserDashboard />;
};

export default Dashboard;

