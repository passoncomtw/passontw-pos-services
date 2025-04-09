import { takeLatest, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  createOrderRequest, 
  createOrderSuccess,
  createOrderFailure,
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  Order,
  OrderItem
} from '../reducers/orderReducer';
import { RootState } from '../index';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'http://api.example.com' // 替換為實際的 API 地址
  : 'http://localhost:8080';

// API 請求函數
const createOrderApi = (orderData: any) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/orders`, orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchOrdersApi = (params?: { shiftId?: string }) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/orders`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 模擬數據
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD001',
    orderType: 'dine_in',
    tableNumber: 'A1',
    status: 'completed',
    items: [
      {
        id: 'item1',
        itemId: 'prod1',
        name: '牛肉麵',
        price: 180,
        quantity: 2,
        options: { 辣度: '中辣' },
      },
      {
        id: 'item2',
        itemId: 'prod2',
        name: '紅茶',
        price: 35,
        quantity: 2,
        options: { 冰塊: '少冰', 甜度: '微糖' },
      }
    ],
    totalAmount: 430,
    paymentMethod: 'cash',
    cashReceived: 500,
    change: 70,
    createdAt: '2023-04-08T12:30:00Z',
    completedAt: '2023-04-08T12:40:00Z',
    shiftId: '1',
  },
  {
    id: '2',
    orderNumber: 'ORD002',
    orderType: 'takeout',
    status: 'completed',
    items: [
      {
        id: 'item3',
        itemId: 'prod3',
        name: '炒飯',
        price: 120,
        quantity: 1,
        options: {},
      }
    ],
    totalAmount: 120,
    paymentMethod: 'cash',
    cashReceived: 200,
    change: 80,
    createdAt: '2023-04-08T14:15:00Z',
    completedAt: '2023-04-08T14:25:00Z',
    shiftId: '1',
  }
];

// 生成唯一 ID
const generateId = () => {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// 生成訂單編號
const generateOrderNumber = () => {
  const prefix = 'ORD';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${date}${random}`;
};

// Saga 函數
function* createOrderSaga(
  action: PayloadAction<{
    orderType: 'dine_in' | 'takeout';
    tableNumber?: string;
    paymentMethod: 'cash' | 'card' | 'other';
    cashReceived?: number;
  }>
) {
  try {
    // 從 state 中獲取當前訂單項目
    const { orderItems, cashReceived, currentShift } = yield select((state: RootState) => state.order);
    
    if (orderItems.length === 0) {
      yield put(createOrderFailure('訂單中沒有商品'));
      return;
    }
    
    if (!currentShift?.id) {
      yield put(createOrderFailure('沒有活動中的班次，請先開始交班'));
      return;
    }
    
    // 計算總金額
    const totalAmount = orderItems.reduce(
      (sum: number, item: OrderItem) => sum + (item.price * item.quantity), 
      0
    );
    
    // 構建訂單數據
    const orderData = {
      orderType: action.payload.orderType,
      tableNumber: action.payload.tableNumber,
      items: orderItems,
      totalAmount,
      paymentMethod: action.payload.paymentMethod,
      cashReceived: action.payload.cashReceived || cashReceived,
      change: action.payload.cashReceived 
        ? action.payload.cashReceived - totalAmount
        : cashReceived - totalAmount,
      shiftId: currentShift.id,
    };
    
    // 正式環境
    // const response = yield call(createOrderApi, orderData);
    // yield put(createOrderSuccess(response.data));
    
    // 開發模擬數據
    const newOrder: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      orderType: orderData.orderType,
      tableNumber: orderData.tableNumber,
      status: 'completed',
      items: orderItems,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      cashReceived: orderData.cashReceived,
      change: orderData.change,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      shiftId: orderData.shiftId,
    };
    
    yield put(createOrderSuccess(newOrder));
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      yield put(createOrderFailure(error.response.data.message || '創建訂單失敗'));
    } else {
      yield put(createOrderFailure('伺服器錯誤，請稍後再試'));
    }
  }
}

function* fetchOrdersSaga(action: PayloadAction<{ shiftId?: string }>) {
  try {
    // 正式環境
    // const response = yield call(fetchOrdersApi, action.payload);
    // yield put(fetchOrdersSuccess(response.data));
    
    // 開發模擬數據
    let filteredOrders = [...mockOrders];
    
    if (action.payload.shiftId) {
      filteredOrders = filteredOrders.filter(order => order.shiftId === action.payload.shiftId);
    }
    
    yield put(fetchOrdersSuccess(filteredOrders));
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      yield put(fetchOrdersFailure(error.response.data.message || '獲取訂單失敗'));
    } else {
      yield put(fetchOrdersFailure('伺服器錯誤，請稍後再試'));
    }
  }
}

// 主 Saga
export default function* orderSaga() {
  yield takeLatest(createOrderRequest.type, createOrderSaga);
  yield takeLatest(fetchOrdersRequest.type, fetchOrdersSaga);
} 