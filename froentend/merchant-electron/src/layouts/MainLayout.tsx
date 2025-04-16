import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../store/reducers/authReducer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 頂部導航欄 */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">商家管理系統</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
                >
                  首頁
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
                >
                  登出
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 側邊欄和主內容區域 */}
      <div className="flex flex-1">
        {/* 側邊導航欄 */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  儀表板
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/orders')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  訂單管理
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/menu')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  菜單管理
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/settings')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  設定
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 主內容區域 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* 頁腳 */}
      <footer className="bg-gray-200 text-gray-600 text-sm p-4 text-center">
        <p>© {new Date().getFullYear()} 商家管理系統 - 版本 1.0.0</p>
      </footer>
    </div>
  );
};

export default MainLayout; 