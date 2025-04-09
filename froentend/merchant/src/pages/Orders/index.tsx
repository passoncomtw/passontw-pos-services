import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  addItem, 
  updateItem, 
  removeItem, 
  clearItems,
  openPaymentModal,
  closePaymentModal,
  setCashReceived,
  createOrderRequest,
  resetCurrentOrder,
  OrderItem
} from '../../store/reducers/orderReducer';
import { fetchCurrentShiftRequest } from '../../store/reducers/shiftReducer';

// 模擬菜品數據
const menuItems = [
  {
    id: 'cat1',
    name: '主食',
    items: [
      { id: '1', name: '牛肉麵', price: 180 },
      { id: '2', name: '雞肉飯', price: 120 },
      { id: '3', name: '豬排飯', price: 150 },
      { id: '4', name: '炒飯', price: 100 },
      { id: '5', name: '燒肉飯', price: 140 },
    ]
  },
  {
    id: 'cat2',
    name: '小吃',
    items: [
      { id: '6', name: '炸雞翅', price: 90 },
      { id: '7', name: '薯條', price: 60 },
      { id: '8', name: '餃子 (5顆)', price: 50 },
      { id: '9', name: '涼拌小黃瓜', price: 40 },
    ]
  },
  {
    id: 'cat3',
    name: '飲料',
    items: [
      { id: '10', name: '紅茶', price: 30 },
      { id: '11', name: '綠茶', price: 30 },
      { id: '12', name: '奶茶', price: 45 },
      { id: '13', name: '可樂', price: 35 },
      { id: '14', name: '柳橙汁', price: 50 },
    ]
  }
];

const Orders = () => {
  const dispatch = useDispatch();
  const { orderItems, loading, error, paymentModalOpen, paymentStatus, cashReceived, change, currentOrder } = useSelector((state: RootState) => state.order);
  const { currentShift } = useSelector((state: RootState) => state.shift);
  
  const [activeCategory, setActiveCategory] = useState(menuItems[0].id);
  const [orderType, setOrderType] = useState<'dine_in' | 'takeout'>('dine_in');
  const [tableNumber, setTableNumber] = useState('1');
  const [cashInput, setCashInput] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  useEffect(() => {
    dispatch(fetchCurrentShiftRequest());
  }, [dispatch]);
  
  // 計算總額
  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // 根據當前 orderItems 生成 ID
  const generateItemId = () => {
    return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  // 添加商品到訂單
  const handleAddItem = (item: { id: string; name: string; price: number }) => {
    const newItem: OrderItem = {
      id: generateItemId(),
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      options: {}
    };
    
    dispatch(addItem(newItem));
  };
  
  // 更新商品數量
  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(index));
      return;
    }
    
    const item = { ...orderItems[index], quantity };
    dispatch(updateItem({ index, item }));
  };
  
  // 打開支付模態框
  const handleOpenPayment = () => {
    if (orderItems.length === 0) {
      alert('請先添加商品到訂單');
      return;
    }
    
    if (!currentShift) {
      alert('沒有活動中的班次，請先開始交班');
      return;
    }
    
    dispatch(openPaymentModal());
  };
  
  // 處理現金輸入
  const handleCashInput = (value: string) => {
    const newCashInput = cashInput + value;
    setCashInput(newCashInput);
    dispatch(setCashReceived(parseFloat(newCashInput) || 0));
  };
  
  // 清除現金輸入
  const handleClearCash = () => {
    setCashInput('');
    dispatch(setCashReceived(0));
  };
  
  // 處理快速現金按鈕
  const handleQuickCash = (amount: number) => {
    setCashInput(amount.toString());
    dispatch(setCashReceived(amount));
  };
  
  // 提交訂單
  const handleSubmitOrder = () => {
    dispatch(createOrderRequest({
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      paymentMethod: 'cash',
      cashReceived
    }));
  };
  
  // 處理訂單完成後的操作
  useEffect(() => {
    if (paymentStatus === 'success') {
      setShowSuccessModal(true);
      // 3秒後自動關閉成功提示
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        dispatch(closePaymentModal());
        dispatch(resetCurrentOrder());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, dispatch]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">點餐與結帳</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 訂單類型選擇 */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="mb-2 text-sm font-medium text-gray-700">訂單類型</div>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  orderType === 'dine_in' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setOrderType('dine_in')}
              >
                內用
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  orderType === 'takeout' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setOrderType('takeout')}
              >
                外帶
              </button>
            </div>
          </div>
          
          {orderType === 'dine_in' && (
            <div className="w-32">
              <div className="mb-2 text-sm font-medium text-gray-700">桌號</div>
              <select
                className="input"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              >
                {Array.from({length: 20}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 菜單區域 */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* 分類標籤 */}
            <div className="flex border-b overflow-x-auto">
              {menuItems.map(category => (
                <button
                  key={category.id}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* 菜品網格 */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {menuItems
                .find(cat => cat.id === activeCategory)?.items
                .map(item => (
                  <button
                    key={item.id}
                    className="bg-white border rounded-lg p-3 text-left hover:border-primary hover:shadow-md transition-all"
                    onClick={() => handleAddItem(item)}
                  >
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-green-600">${item.price}</div>
                  </button>
                ))}
            </div>
          </div>
        </div>
        
        {/* 訂單摘要 */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
            <div className="mb-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">訂單摘要</h2>
              <button
                className="text-sm text-gray-600 hover:text-red-600"
                onClick={() => dispatch(clearItems())}
                disabled={orderItems.length === 0}
              >
                清空
              </button>
            </div>
            
            {/* 訂單資訊 */}
            <div className="mb-2 text-sm text-gray-600">
              {orderType === 'dine_in' ? `內用 - 桌號 ${tableNumber}` : '外帶'}
            </div>
            
            {/* 訂單項目列表 */}
            {orderItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                尚未添加任何商品
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto mb-4">
                {orderItems.map((item, index) => (
                  <div key={item.id} className="py-3 border-b flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">${item.price}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-5 text-center">{item.quantity}</span>
                      <button
                        className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 總計和結帳按鈕 */}
            <div>
              <div className="flex justify-between py-2 font-bold text-lg border-t">
                <span>總計</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-full mt-4"
                onClick={handleOpenPayment}
                disabled={orderItems.length === 0 || loading || !currentShift}
              >
                {!currentShift ? '請先開始交班' : '前往結帳'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 結帳模態框 */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">結帳</h2>
            
            {/* 訂單信息 */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="mb-2 text-sm">
                {orderType === 'dine_in' ? `內用 - 桌號 ${tableNumber}` : '外帶'}
              </div>
              
              <div className="max-h-32 overflow-y-auto mb-2">
                {orderItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>總計</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {/* 現金輸入 */}
            <div className="mb-4">
              <div className="relative mb-1">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-gray-600">
                  $
                </div>
                <input
                  type="text"
                  className="input pl-8 text-lg font-bold"
                  value={cashInput}
                  readOnly
                />
                <button
                  className="absolute right-0 top-0 bottom-0 px-3 text-gray-600"
                  onClick={handleClearCash}
                >
                  清除
                </button>
              </div>
              {cashReceived > 0 && cashReceived >= totalAmount && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>找零</span>
                  <span className="font-medium text-green-600">${change.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            {/* 快速金額按鈕 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  className="bg-blue-50 hover:bg-blue-100 p-2 rounded-md font-medium"
                  onClick={() => handleQuickCash(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
            
            {/* 數字鍵盤 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                <button
                  key={num}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-md font-medium"
                  onClick={() => handleCashInput(num.toString())}
                >
                  {num}
                </button>
              ))}
              <button
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-md font-medium"
                onClick={() => handleCashInput('00')}
              >
                00
              </button>
            </div>
            
            {/* 操作按鈕 */}
            <div className="flex space-x-3">
              <button
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-md"
                onClick={() => dispatch(closePaymentModal())}
              >
                取消
              </button>
              <button
                className={`flex-1 py-2 bg-primary text-white rounded-md ${
                  loading || cashReceived < totalAmount ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={handleSubmitOrder}
                disabled={loading || cashReceived < totalAmount}
              >
                {loading ? '處理中...' : '完成結帳'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 結帳成功模態框 */}
      {showSuccessModal && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-xl font-semibold mb-2">結帳成功！</h2>
              <p className="text-gray-600 mb-4">訂單 #{currentOrder.orderNumber} 已完成</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between font-semibold mb-2">
                  <span>總計</span>
                  <span>${currentOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>收款</span>
                  <span>${currentOrder.cashReceived?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>找零</span>
                  <span>${currentOrder.change?.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">收據已自動列印</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 