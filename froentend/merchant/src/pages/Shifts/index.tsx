import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchShiftsRequest, 
  fetchCurrentShiftRequest, 
  startShiftRequest,
  endShiftRequest,
  Shift
} from '../../store/reducers/shiftReducer';
import { RootState } from '../../store';
import { fetchOrdersRequest } from '../../store/reducers/orderReducer';

const Shifts = () => {
  const dispatch = useDispatch();
  const { shifts, currentShift, loading, error } = useSelector((state: RootState) => state.shift);
  const { orders } = useSelector((state: RootState) => state.order);
  const [startCashAmount, setStartCashAmount] = useState('1000');
  const [endCashAmount, setEndCashAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  useEffect(() => {
    dispatch(fetchShiftsRequest());
    dispatch(fetchCurrentShiftRequest());
  }, [dispatch]);
  
  // 當選擇一個班次時，獲取該班次的訂單
  useEffect(() => {
    if (selectedShift) {
      dispatch(fetchOrdersRequest({ shiftId: selectedShift.id }));
    }
  }, [dispatch, selectedShift]);
  
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
  
  // 處理開始班次
  const handleStartShift = () => {
    dispatch(startShiftRequest({ 
      startCashAmount: parseFloat(startCashAmount), 
      notes: notes || undefined 
    }));
    setShowStartModal(false);
    setNotes('');
  };
  
  // 處理結束班次
  const handleEndShift = () => {
    if (currentShift) {
      dispatch(endShiftRequest({ 
        endCashAmount: parseFloat(endCashAmount), 
        notes: notes || undefined 
      }));
      setShowEndModal(false);
      setNotes('');
    }
  };
  
  // 開啟結束班次的模態框並設置預設現金金額（當前起始金額 + 總銷售額）
  const openEndModal = () => {
    if (currentShift) {
      // 計算當前班次的總銷售額
      const totalSales = currentShift.totalSales;
      const suggestedEndAmount = currentShift.startCashAmount + totalSales;
      setEndCashAmount(suggestedEndAmount.toString());
      setShowEndModal(true);
    }
  };
  
  // 顯示班次詳情
  const showShiftDetails = (shift: Shift) => {
    setSelectedShift(shift);
    // 獲取該班次的訂單
    dispatch(fetchOrdersRequest({ shiftId: shift.id }));
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">交班管理</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 當前班次狀態 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">當前班次狀態</h2>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : currentShift ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <div className="flex justify-end">
              <button 
                onClick={openEndModal}
                className="btn btn-primary"
                disabled={loading}
              >
                結束班次
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">目前沒有活動中的班次。</p>
            <button 
              onClick={() => setShowStartModal(true)}
              className="btn btn-primary"
              disabled={loading}
            >
              開始班次
            </button>
          </div>
        )}
      </div>
      
      {/* 班次列表與詳情 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 班次列表 */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">班次記錄</h2>
            {shifts.length === 0 ? (
              <p className="text-gray-600">沒有班次記錄。</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {shifts.map((shift) => (
                  <div 
                    key={shift.id}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedShift?.id === shift.id 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => showShiftDetails(shift)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{formatDateTime(shift.startTime)}</p>
                        <p className="text-sm text-gray-600">
                          {shift.status === 'active' ? (
                            <span className="text-green-600">● 進行中</span>
                          ) : (
                            <span>結束於: {formatDateTime(shift.endTime)}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${shift.totalSales}</p>
                        <p className="text-sm text-gray-600">{shift.totalOrders} 筆訂單</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 班次詳情 */}
        <div className="lg:col-span-2">
          {selectedShift ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">班次詳情</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">開始時間</p>
                  <p className="font-medium">{formatDateTime(selectedShift.startTime)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">結束時間</p>
                  <p className="font-medium">{formatDateTime(selectedShift.endTime)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">狀態</p>
                  <p className="font-medium">
                    {selectedShift.status === 'active' ? '進行中' : '已結束'}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">初始金額</p>
                  <p className="font-medium">${selectedShift.startCashAmount}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">結束金額</p>
                  <p className="font-medium">
                    {selectedShift.endCashAmount ? `$${selectedShift.endCashAmount}` : '-'}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">總銷售額</p>
                  <p className="font-medium">${selectedShift.totalSales}</p>
                </div>
              </div>
              
              {selectedShift.notes && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">備註</h3>
                  <p className="bg-gray-50 p-3 rounded-lg">{selectedShift.notes}</p>
                </div>
              )}
              
              <h3 className="font-medium mb-3">訂單列表 ({orders.length})</h3>
              
              {orders.length === 0 ? (
                <p className="text-gray-600">此班次沒有訂單記錄。</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">訂單編號</th>
                        <th className="px-4 py-2">類型</th>
                        <th className="px-4 py-2">時間</th>
                        <th className="px-4 py-2">金額</th>
                        <th className="px-4 py-2">付款方式</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{order.orderNumber}</td>
                          <td className="px-4 py-3">
                            {order.orderType === 'dine_in' ? '內用' : '外帶'}
                            {order.tableNumber ? ` (${order.tableNumber})` : ''}
                          </td>
                          <td className="px-4 py-3">{formatDateTime(order.createdAt)}</td>
                          <td className="px-4 py-3 font-medium">${order.totalAmount}</td>
                          <td className="px-4 py-3">
                            {order.paymentMethod === 'cash' ? '現金' : 
                             order.paymentMethod === 'card' ? '刷卡' : '其他'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center h-full">
              <p className="text-gray-500">請選擇一個班次查看詳情</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 開始班次模態框 */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">開始新班次</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                初始現金金額
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                  $
                </span>
                <input
                  type="number"
                  className="input pl-8"
                  value={startCashAmount}
                  onChange={(e) => setStartCashAmount(e.target.value)}
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                備註 (選填)
              </label>
              <textarea
                className="input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setShowStartModal(false);
                  setNotes('');
                }}
              >
                取消
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleStartShift}
                disabled={!startCashAmount || loading}
              >
                開始班次
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 結束班次模態框 */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">結束當前班次</h2>
            
            {currentShift && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">開始時間</p>
                  <p className="text-sm font-medium">{formatDateTime(currentShift.startTime)}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">總銷售額</p>
                  <p className="text-sm font-medium">${currentShift.totalSales}</p>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                結束現金金額
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                  $
                </span>
                <input
                  type="number"
                  className="input pl-8"
                  value={endCashAmount}
                  onChange={(e) => setEndCashAmount(e.target.value)}
                  min="0"
                  step="100"
                  required
                />
              </div>
              {currentShift && (
                <p className="text-sm text-gray-600 mt-1">
                  建議金額: ${currentShift.startCashAmount + currentShift.totalSales}
                  (初始 ${currentShift.startCashAmount} + 銷售 ${currentShift.totalSales})
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                備註 (選填)
              </label>
              <textarea
                className="input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setShowEndModal(false);
                  setNotes('');
                }}
              >
                取消
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEndShift}
                disabled={!endCashAmount || loading}
              >
                結束班次
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shifts; 