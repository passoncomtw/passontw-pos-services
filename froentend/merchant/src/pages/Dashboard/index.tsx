import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchCurrentShiftRequest } from '../../store/reducers/shiftReducer';
import { fetchOrdersRequest } from '../../store/reducers/orderReducer';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentShift } = useSelector((state: RootState) => state.shift);
  const { orders } = useSelector((state: RootState) => state.order);
  
  useEffect(() => {
    dispatch(fetchCurrentShiftRequest());
    
    // 如果有當前班次，獲取該班次的訂單
    if (currentShift) {
      dispatch(fetchOrdersRequest({ shiftId: currentShift.id }));
    }
  }, [dispatch, currentShift?.id]);
  
  // 格式化日期時間
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">主頁面</h1>
      
      {/* 當前班次信息 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">當前班次</h2>
        
        {currentShift ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">開始時間</p>
              <p className="font-medium">{formatDateTime(currentShift.startTime)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">初始金額</p>
              <p className="font-medium">${currentShift.startCashAmount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">當前銷售額</p>
              <p className="font-medium">${currentShift.totalSales}</p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
            <p>目前沒有活動中的班次，請前往交班管理開始新的班次。</p>
          </div>
        )}
      </div>
      
      {/* 今日訂單統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">今日訂單統計</h2>
          
          {currentShift ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">訂單總數</p>
                <p className="font-bold text-2xl">{currentShift.totalOrders}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">銷售總額</p>
                <p className="font-bold text-2xl">${currentShift.totalSales}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">無數據</p>
          )}
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">訂單類型分布</h2>
          
          {orders.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">內用</p>
                <p className="font-bold text-2xl">
                  {orders.filter(order => order.orderType === 'dine_in').length}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">外帶</p>
                <p className="font-bold text-2xl">
                  {orders.filter(order => order.orderType === 'takeout').length}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">無數據</p>
          )}
        </div>
      </div>
      
      {/* 最近訂單 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">最近訂單</h2>
        
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">訂單編號</th>
                  <th className="px-4 py-2">類型</th>
                  <th className="px-4 py-2">時間</th>
                  <th className="px-4 py-2">金額</th>
                  <th className="px-4 py-2">狀態</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      {order.orderType === 'dine_in' ? '內用' : '外帶'}
                      {order.tableNumber ? ` (${order.tableNumber})` : ''}
                    </td>
                    <td className="px-4 py-3">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3 font-medium">${order.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? '已完成' : 
                         order.status === 'cancelled' ? '已取消' : '處理中'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">尚無訂單資料</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 