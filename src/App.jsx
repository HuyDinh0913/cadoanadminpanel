// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminLayout from './components/AdminLayout.jsx';

// (Import các trang khác của bạn) - BỎ COMMENT RA ĐỂ DÙNG
import DashboardPage from './pages/DashboardPage.jsx'; 
import SongManager from './pages/SongManager.jsx';
import EventManager from './pages/EventManager.jsx';
import NewsManager from './pages/NewsManager.jsx';
import CommitteeManager from './pages/CommitteeManager.jsx';
import DocumentManager from './pages/DocumentManager.jsx';
import GalleryManager from './pages/GalleryManager.jsx';

function App() {
  // Logic xác thực đơn giản
  // Trong dự án thật, bạn sẽ lưu token (JWT) trong localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Tạm để true để test

  const handleLogin = () => {
    // Gọi API login...
    // Nếu thành công:
    setIsAuthenticated(true);
    // (Lưu token vào localStorage)
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // (Xóa token khỏi localStorage)
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace /> // Nếu đã login, đá về trang chủ
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        
        {/* ---- PHẦN SỬA ĐỔI QUAN TRỌNG ---- */}
        {/* Thay vì dùng path="/*", chúng ta dùng path="/" làm route cha (parent route).
          Tất cả các route con bên trong sẽ được render vào <Outlet /> của AdminLayout.
        */}
        <Route
          path="/" 
          element={
            isAuthenticated ? (
              <AdminLayout onLogout={handleLogout} /> 
            ) : (
              <Navigate to="/login" replace /> // Nếu chưa login, đá về trang login
            )
          }
        >
          {/* Đây là các trang con (children) sẽ render trong <Outlet /> */}
          {/* Trang chủ mặc định, điều hướng về /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} /> 
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="songs" element={<SongManager />} />
          <Route path="events" element={<EventManager />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="committee" element={<CommitteeManager />} />
          <Route path="documents" element={<DocumentManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          
          {/* Route "catch-all" cho các trang không tìm thấy (trong layout admin) */}
          <Route path="*" element={
            <div style={{ padding: 20 }}>
              <h2>404 - Trang không tìm thấy</h2>
              <p>Trang bạn đang tìm kiếm không tồn tại.</p>
            </div>
          } /> 
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;