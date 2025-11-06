import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./features/auth/contexts/AuthContext";
import Login from "./features/auth/pages/Login";
import Dashboard from "./features/auth/pages/Dashboard";
import { useContext } from "react";
import App from "./App";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function MainApp() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Trang đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Trang dashboard — chỉ truy cập nếu đã login */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Mặc định: nếu không có đường dẫn, chuyển hướng */}
         {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
