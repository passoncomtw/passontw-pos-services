import { useState } from 'react';

// 菜品分類接口
interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

// 菜品選項接口
interface ItemOption {
  name: string;
  choices: {
    name: string;
    price: number;
  }[];
}

// 菜品接口
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  options: ItemOption[];
  active: boolean;
}

// 模擬數據
const initialCategories: Category[] = [
  { id: '1', name: '主食', displayOrder: 1 },
  { id: '2', name: '湯品', displayOrder: 2 },
  { id: '3', name: '小菜', displayOrder: 3 },
  { id: '4', name: '飲料', displayOrder: 4 },
];

const initialMenuItems: MenuItem[] = [
  {
    id: '1', 
    name: '紅燒牛肉麵', 
    description: '特選澳洲牛肉，熬煮八小時湯頭',
    price: 180,
    categoryId: '1',
    imageUrl: 'https://via.placeholder.com/100',
    options: [
      {
        name: '麵條',
        choices: [
          { name: '細麵', price: 0 },
          { name: '寬麵', price: 0 },
        ]
      },
      {
        name: '辣度',
        choices: [
          { name: '不辣', price: 0 },
          { name: '小辣', price: 0 },
          { name: '中辣', price: 10 },
          { name: '大辣', price: 20 },
        ]
      }
    ],
    active: true
  },
  {
    id: '2', 
    name: '滷肉飯', 
    description: '傳統台式滷肉，搭配白飯',
    price: 60,
    categoryId: '1',
    imageUrl: 'https://via.placeholder.com/100',
    options: [],
    active: true
  },
  {
    id: '3', 
    name: '酸辣湯', 
    description: '酸中帶辣，開胃爽口',
    price: 50,
    categoryId: '2',
    imageUrl: 'https://via.placeholder.com/100',
    options: [
      {
        name: '辣度',
        choices: [
          { name: '小辣', price: 0 },
          { name: '中辣', price: 0 },
          { name: '大辣', price: 0 },
        ]
      }
    ],
    active: true
  },
  {
    id: '4', 
    name: '涼拌黃瓜', 
    description: '清脆爽口，開胃小菜',
    price: 40,
    categoryId: '3',
    imageUrl: 'https://via.placeholder.com/100',
    options: [],
    active: true
  },
  {
    id: '5', 
    name: '珍珠奶茶', 
    description: '香濃奶茶搭配彈牙珍珠',
    price: 60,
    categoryId: '4',
    imageUrl: 'https://via.placeholder.com/100',
    options: [
      {
        name: '甜度',
        choices: [
          { name: '無糖', price: 0 },
          { name: '微糖', price: 0 },
          { name: '半糖', price: 0 },
          { name: '全糖', price: 0 },
        ]
      },
      {
        name: '冰塊',
        choices: [
          { name: '去冰', price: 0 },
          { name: '微冰', price: 0 },
          { name: '正常冰', price: 0 },
        ]
      }
    ],
    active: true
  },
];

const Menu = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditingItem, setIsEditingItem] = useState<boolean>(false);
  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{show: boolean, type: 'item' | 'category', id: string}>({
    show: false, 
    type: 'item', 
    id: ''
  });

  // 根據分類過濾菜品
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === selectedCategory);

  // 獲取分類名稱
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '未分類';
  };

  // 添加或編輯菜品（模擬）
  const handleSaveItem = (item: MenuItem) => {
    if (item.id) {
      // 編輯現有菜品
      setMenuItems(menuItems.map(i => i.id === item.id ? item : i));
    } else {
      // 添加新菜品
      const newItem = {
        ...item,
        id: Date.now().toString(),
      };
      setMenuItems([...menuItems, newItem]);
    }
    setIsEditingItem(false);
    setCurrentItem(null);
  };

  // 添加或編輯分類（模擬）
  const handleSaveCategory = (category: Category) => {
    if (category.id) {
      // 編輯現有分類
      setCategories(categories.map(c => c.id === category.id ? category : c));
    } else {
      // 添加新分類
      const newCategory = {
        ...category,
        id: Date.now().toString(),
      };
      setCategories([...categories, newCategory]);
    }
    setIsEditingCategory(false);
    setCurrentCategory(null);
  };

  // 處理刪除確認
  const handleDelete = () => {
    const { type, id } = showDeleteConfirm;
    
    if (type === 'item') {
      setMenuItems(menuItems.filter(item => item.id !== id));
    } else {
      setCategories(categories.filter(cat => cat.id !== id));
      // 將屬於此分類的菜品設置為未分類
      setMenuItems(menuItems.map(item => 
        item.categoryId === id ? {...item, categoryId: ''} : item
      ));
    }
    
    setShowDeleteConfirm({show: false, type: 'item', id: ''});
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">菜單管理</h1>
      
      {/* 標籤切換 */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'items' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} 
          onClick={() => setActiveTab('items')}
        >
          菜品管理
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} 
          onClick={() => setActiveTab('categories')}
        >
          分類管理
        </button>
      </div>
      
      {/* 菜品管理 */}
      {activeTab === 'items' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <label htmlFor="category-filter" className="mr-2">分類篩選：</label>
              <select 
                id="category-filter" 
                className="border rounded-md p-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">全部菜品</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setCurrentItem({
                  id: '',
                  name: '',
                  description: '',
                  price: 0,
                  categoryId: categories.length > 0 ? categories[0].id : '',
                  imageUrl: '',
                  options: [],
                  active: true
                });
                setIsEditingItem(true);
              }}
            >
              添加菜品
            </button>
          </div>

          {/* 菜品列表 */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">圖片</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">菜品名稱</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分類</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">價格</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.active ? '上架中' : '已下架'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {
                          setCurrentItem(item);
                          setIsEditingItem(true);
                        }}
                      >
                        編輯
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => setShowDeleteConfirm({
                          show: true,
                          type: 'item',
                          id: item.id
                        })}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      沒有找到菜品
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* 分類管理 */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-end mb-4">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setCurrentCategory({
                  id: '',
                  name: '',
                  displayOrder: categories.length + 1
                });
                setIsEditingCategory(true);
              }}
            >
              添加分類
            </button>
          </div>

          {/* 分類列表 */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分類名稱</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顯示順序</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">菜品數量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.displayOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {menuItems.filter(item => item.categoryId === category.id).length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {
                          setCurrentCategory(category);
                          setIsEditingCategory(true);
                        }}
                      >
                        編輯
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => setShowDeleteConfirm({
                          show: true,
                          type: 'category',
                          id: category.id
                        })}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      沒有找到分類
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 編輯菜品彈窗 */}
      {isEditingItem && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentItem.id ? '編輯菜品' : '添加菜品'}</h2>
              <button onClick={() => {
                setIsEditingItem(false);
                setCurrentItem(null);
              }}>✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">菜品名稱</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea 
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">價格</label>
                  <input 
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({...currentItem, price: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={currentItem.categoryId}
                    onChange={(e) => setCurrentItem({...currentItem, categoryId: e.target.value})}
                  >
                    <option value="">未分類</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">圖片 URL</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={currentItem.imageUrl}
                  onChange={(e) => setCurrentItem({...currentItem, imageUrl: e.target.value})}
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="active"
                  className="mr-2"
                  checked={currentItem.active}
                  onChange={(e) => setCurrentItem({...currentItem, active: e.target.checked})}
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">上架</label>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setIsEditingItem(false);
                    setCurrentItem(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleSaveItem(currentItem)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 編輯分類彈窗 */}
      {isEditingCategory && currentCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentCategory.id ? '編輯分類' : '添加分類'}</h2>
              <button onClick={() => {
                setIsEditingCategory(false);
                setCurrentCategory(null);
              }}>✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分類名稱</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">顯示順序</label>
                <input 
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={currentCategory.displayOrder}
                  onChange={(e) => setCurrentCategory({...currentCategory, displayOrder: Number(e.target.value)})}
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setIsEditingCategory(false);
                    setCurrentCategory(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleSaveCategory(currentCategory)}
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
            <p className="mb-6">您確定要刪除這個{showDeleteConfirm.type === 'item' ? '菜品' : '分類'}嗎？{showDeleteConfirm.type === 'category' && '所有屬於此分類的菜品將變為未分類。'}</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm({show: false, type: 'item', id: ''})}
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

export default Menu; 