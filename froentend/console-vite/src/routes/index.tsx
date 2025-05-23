import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MainLayout from '../layouts/MainLayout';
import { CircularProgress, Box } from '@mui/material';

// 使用 React.lazy 動態導入頁面組件
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Users = lazy(() => import('../pages/Users'));
const Menu = lazy(() => import('../pages/Menu'));
const Orders = lazy(() => import('../pages/Orders'));
const Shifts = lazy(() => import('../pages/Shifts'));

// 載入中組件
const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// 路由路徑常數
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  MENU: '/menu',
  ORDERS: '/orders',
  SHIFTS: '/shifts',
} as const;

type RoutePathType = typeof ROUTES[keyof typeof ROUTES];

// 私有路由組件型別
interface PrivateRouteProps {
  children: React.ReactNode;
}

// 路由配置型別
interface RouteConfig {
  path: RoutePathType;
  element: React.ReactElement;
}

// 私有路由組件
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

// 主要路由配置
const mainRoutes: RouteConfig[] = [
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.USERS, element: <Users /> },
  { path: ROUTES.MENU, element: <Menu /> },
  { path: ROUTES.ORDERS, element: <Orders /> },
  { path: ROUTES.SHIFTS, element: <Shifts /> },
];

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 登入路由 */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* 受保護的路由 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path === ROUTES.DASHBOARD ? '' : route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 