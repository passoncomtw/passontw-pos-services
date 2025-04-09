import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logoutRequest } from '../../store/reducers/authReducer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // 從 Redux store 獲取認證狀態
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const navItems = [
    { name: '主頁面', path: '/dashboard', icon: '📊' },
    { name: '點餐管理', path: '/orders', icon: '🍽️' },
    { name: '菜單管理', path: '/menu', icon: '📋' },
    { name: '交班管理', path: '/shifts', icon: '🔄' },
    { name: '用戶管理', path: '/users', icon: '👥' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logoutRequest());
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // 如果未認證，重定向到登入頁面
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 確認登出對話框 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">確認登出</h2>
            <p className="mb-6">您確定要登出系統嗎？</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleLogoutCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                確定登出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 側邊欄 */}
      <div 
        className={`bg-blue-800 text-white ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 hidden md:block`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold ${isSidebarOpen ? 'text-xl' : 'text-sm'}`}>
            {isSidebarOpen ? '餐飲POS系統' : 'POS'}
          </h1>
          <button 
            onClick={toggleSidebar}
            className="text-white hover:text-gray-300"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <div className="mt-8">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`flex items-center p-4 ${
                location.pathname === item.path
                  ? 'bg-blue-500'
                  : 'hover:bg-blue-700'
              } cursor-pointer`}
              onClick={() => navigate(item.path)}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {isSidebarOpen && <span>{item.name}</span>}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-0 w-full">
          {isSidebarOpen && (
            <div className="p-4 border-t border-blue-900">
              <p className="text-sm text-gray-300">使用者: {user?.name}</p>
            </div>
          )}
          <div
            className="flex items-center p-4 hover:cursor-pointer"
            onClick={handleLogoutClick}
          >
            <span className="text-xl mr-3">🚪</span>
            {isSidebarOpen && <span>登出</span>}
          </div>
        </div>
      </div>
      
      {/* 行動裝置導航欄 */}
      <div className="bg-blue-800 text-white p-4 w-full fixed top-0 z-10 md:hidden">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">餐飲POS系統</h1>
          <button 
            onClick={toggleSidebar}
            className="text-white"
          >
            ☰
          </button>
        </div>
      </div>
      
      {/* 行動裝置側邊欄 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="bg-blue-800 text-white w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between">
              <h1 className="font-bold text-xl">餐飲POS系統</h1>
              <button onClick={() => setIsSidebarOpen(false)}>✕</button>
            </div>
            
            <div className="mt-8">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  className={`flex items-center p-4 ${
                    location.pathname === item.path
                      ? 'bg-blue-500'
                      : 'hover:bg-blue-700'
                  } cursor-pointer`}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-0 w-full">
              <div className="p-4 border-t border-blue-900">
                <p className="text-sm text-gray-300">使用者: {user?.name}</p>
              </div>
              <div
                className="flex items-center p-4 hover:bg-red-700 cursor-pointer"
                onClick={handleLogoutClick}
              >
                <span className="text-xl mr-3">🚪</span>
                <span>登出</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 主內容區域 */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 mt-16 md:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 