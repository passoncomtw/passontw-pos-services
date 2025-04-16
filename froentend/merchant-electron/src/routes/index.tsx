import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { checkAuthState } from '../store/reducers/authReducer';

// 頁面和佈局導入
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

// 需要驗證的路由
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // 如果未認證且不在加載狀態，重定向到登入頁面
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // 如果在加載狀態，顯示加載指示器
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // 如果已認證，顯示子元素
  return isAuthenticated ? <>{children}</> : null;
};

// 公共路由
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // 如果已認證，重定向到儀表板
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? <>{children}</> : null;
};

// 應用程序路由
const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 在應用加載時檢查認證狀態
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </PrivateRoute>
      } />

      {/* 默認重定向到儀表板 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 頁面 */}
      <Route path="*" element={
        <div className="flex h-screen items-center justify-center flex-col">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl">找不到頁面</p>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes; 