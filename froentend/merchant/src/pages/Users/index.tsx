import { useState } from 'react';

// 用戶角色類型
type UserRole = 'admin' | 'manager' | 'staff' | 'cashier';

// 用戶接口
interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
}

// 模擬數據
const initialUsers: User[] = [
  {
    id: '1',
    name: '王小明',
    username: 'wang_admin',
    role: 'admin',
    email: 'wang@example.com',
    phone: '0912-345-678',
    active: true,
    createdAt: '2023-01-01T08:30:00.000Z'
  },
  {
    id: '2',
    name: '林經理',
    username: 'lin_manager',
    role: 'manager',
    email: 'lin@example.com',
    phone: '0923-456-789',
    active: true,
    createdAt: '2023-02-15T10:00:00.000Z'
  },
  {
    id: '3',
    name: '陳小姐',
    username: 'chen_staff',
    role: 'staff',
    email: 'chen@example.com',
    phone: '0934-567-890',
    active: true,
    createdAt: '2023-03-20T14:30:00.000Z'
  },
  {
    id: '4',
    name: '李先生',
    username: 'li_cashier',
    role: 'cashier',
    email: 'li@example.com',
    phone: '0945-678-901',
    active: false,
    createdAt: '2023-04-05T09:45:00.000Z'
  }
];

// 角色中文名稱映射
const roleNames: Record<UserRole, string> = {
  admin: '系統管理員',
  manager: '店長',
  staff: '員工',
  cashier: '收銀員'
};

const Users = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{show: boolean, id: string}>({
    show: false, 
    id: ''
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // 根據搜索詞和過濾角色過濾用戶
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 添加或編輯用戶（模擬）
  const handleSaveUser = (user: User) => {
    if (user.id) {
      // 編輯現有用戶
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      // 添加新用戶
      const newUser = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
    }
    setIsEditingUser(false);
    setCurrentUser(null);
  };

  // 處理刪除確認
  const handleDelete = () => {
    setUsers(users.filter(user => user.id !== showDeleteConfirm.id));
    setShowDeleteConfirm({show: false, id: ''});
  };

  // 檢查用戶是否可刪除
  const canDeleteUser = (user: User): boolean => {
    return user.role !== 'admin';
  };

  // 顯示刪除確認
  const handleShowDeleteConfirm = (userId: string) => {
    setShowDeleteConfirm({
      show: true,
      id: userId
    });
  };

  // 檢查是否可編輯角色
  const canEditRole = (user: User): boolean => {
    return user.id === '' || user.role !== 'admin';
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">用戶管理</h1>
      
      {/* 搜索和過濾 */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">搜索用戶</label>
              <input 
                type="text" 
                id="search"
                className="border rounded-md p-2 w-full md:w-64"
                placeholder="姓名、帳號或電子郵件"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">角色過濾</label>
              <select 
                id="role-filter" 
                className="border rounded-md p-2 w-full md:w-40"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">全部角色</option>
                <option value="admin">系統管理員</option>
                <option value="manager">店長</option>
                <option value="staff">員工</option>
                <option value="cashier">收銀員</option>
              </select>
            </div>
          </div>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setCurrentUser({
                id: '',
                name: '',
                username: '',
                role: 'staff',
                email: '',
                phone: '',
                active: true,
                createdAt: new Date().toISOString()
              });
              setIsEditingUser(true);
            }}
          >
            添加用戶
          </button>
        </div>
      </div>

      {/* 用戶列表 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用戶</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">聯絡資訊</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {roleNames[user.role]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.active ? '啟用' : '停用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => {
                      setCurrentUser(user);
                      setIsEditingUser(true);
                    }}
                  >
                    編輯
                  </button>
                  {canDeleteUser(user) ? (
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleShowDeleteConfirm(user.id)}
                    >
                      刪除
                    </button>
                  ) : (
                    <span className="text-gray-400 cursor-not-allowed" title="無法刪除系統管理員">刪除</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  沒有找到用戶
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 編輯用戶彈窗 */}
      {isEditingUser && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentUser.id ? '編輯用戶' : '添加用戶'}</h2>
              <button onClick={() => {
                setIsEditingUser(false);
                setCurrentUser(null);
              }}>✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">帳號</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={currentUser.username}
                  onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                {canEditRole(currentUser) ? (
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={currentUser.role}
                    onChange={(e) => setCurrentUser({...currentUser, role: e.target.value as UserRole})}
                  >
                    <option value="admin">系統管理員</option>
                    <option value="manager">店長</option>
                    <option value="staff">員工</option>
                    <option value="cashier">收銀員</option>
                  </select>
                ) : (
                  <div>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded-md bg-gray-100"
                      value={roleNames[currentUser.role]}
                      readOnly
                    />
                    <p className="text-xs text-red-500 mt-1">無法變更系統管理員角色</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                <input 
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={currentUser.phone}
                  onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})}
                />
              </div>
              
              <div className="flex items-center">
                {currentUser.role === 'admin' && currentUser.id ? (
                  <>
                    <input 
                      type="checkbox"
                      id="active"
                      className="mr-2"
                      checked={true}
                      readOnly
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">啟用</label>
                    <p className="text-xs text-red-500 ml-2">無法停用系統管理員</p>
                  </>
                ) : (
                  <>
                    <input 
                      type="checkbox"
                      id="active"
                      className="mr-2"
                      checked={currentUser.active}
                      onChange={(e) => setCurrentUser({...currentUser, active: e.target.checked})}
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">啟用</label>
                  </>
                )}
              </div>
              
              {!currentUser.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
                  <input 
                    type="password"
                    className="w-full p-2 border rounded-md"
                    placeholder="設定新密碼"
                  />
                  <p className="text-xs text-gray-500 mt-1">密碼需包含英文字母、數字，至少8個字符</p>
                </div>
              )}
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setIsEditingUser(false);
                    setCurrentUser(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleSaveUser(currentUser)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 刪除確認彈窗 */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">確認刪除</h2>
            <p className="mb-6">您確定要刪除這個用戶嗎？此操作無法復原。</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm({show: false, id: ''})}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                確定刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 