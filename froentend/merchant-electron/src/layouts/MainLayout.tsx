import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutRequest } from '../store/reducers/authReducer';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  path: string;
  label: string;
  iconText: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarItems: SidebarItem[] = [
    { 
      path: '/dashboard', 
      label: '主畫面', 
      iconText: '🏠'
    },
    { 
      path: '/orders', 
      label: '點餐管理', 
      iconText: '🍽️'
    },
    { 
      path: '/menu', 
      label: '菜單管理', 
      iconText: '📋'
    },
    { 
      path: '/shifts', 
      label: '交班管理', 
      iconText: '🔄'
    },
    { 
      path: '/users', 
      label: '用戶管理', 
      iconText: '👥'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 頂部導航欄 */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-4 p-1 hover:bg-primary-dark rounded-md transition-colors md:hidden"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold">餐飲 POS 系統</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
                >
                  <span className="mr-2">🚪</span>
                  <span>登出</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 側邊欄和主內容區域 */}
      <div className="flex flex-1">
        {/* 側邊導航欄 */}
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-md transition-all duration-300 z-20 ${isSidebarCollapsed ? 'md:w-16' : 'md:w-64'} fixed md:static h-full ${isSidebarCollapsed ? '-translate-x-full md:translate-x-0' : ''}`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="mr-3 text-xl">{item.iconText}</span>
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* 遮罩層 - 在手機版側邊欄打開時顯示 */}
        {!isSidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* 主內容區域 */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-0'}`}>
          {children}
        </main>
      </div>

      {/* 頁腳 */}
      <footer className="bg-gray-200 text-gray-600 text-sm p-4 text-center">
        <p>© {new Date().getFullYear()} 餐飲 POS 系統 - 版本 1.0.0</p>
      </footer>
    </div>
  );
};

export default MainLayout; 