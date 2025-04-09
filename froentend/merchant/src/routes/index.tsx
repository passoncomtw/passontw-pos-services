import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Menu from '../pages/Menu';
import Shifts from '../pages/Shifts';
import Users from '../pages/Users';
import { RootState } from '../store';
import { checkAuthState } from '../store/reducers/authReducer';

// 需要驗證的路由
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // 如果未認證且不在加載狀態，重定向到登入頁面
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // 如果在加載狀態，顯示加載指示器
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // 如果已認證，顯示子元素
  return isAuthenticated ? <>{children}</> : null;
};

// 公共路由
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  // 如果已認證，重定向到儀表板
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return !isAuthenticated ? <>{children}</> : null;
};

const AppRoutes = () => {
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
      
      <Route path="/orders" element={
        <PrivateRoute>
          <MainLayout>
            <Orders />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/menu" element={
        <PrivateRoute>
          <MainLayout>
            <Menu />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/shifts" element={
        <PrivateRoute>
          <MainLayout>
            <Shifts />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/users" element={
        <PrivateRoute>
          <MainLayout>
            <Users />
          </MainLayout>
        </PrivateRoute>
      } />
      
      {/* 默認重定向到儀表板 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 頁面 */}
      <Route path="*" element={<div>找不到頁面</div>} />
    </Routes>
  );
};

export default AppRoutes; 