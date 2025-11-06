/*
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
*/
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/contexts/AuthContext'; // giả sử hook trả { user, loading }
import Loader from './Loader';
const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Khi đang kiểm tra trạng thái đăng nhập (đọc từ localStorage)
  if (loading) {
    return <Loader />; // hoặc <div>Đang tải...</div>
  }

  // Nếu đã có user => cho truy cập, nếu chưa => redirect về login
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;