import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  options: Record<string, any>;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: 'dine_in' | 'takeout';
  tableNumber?: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'other';
  cashReceived?: number;
  change?: number;
  createdAt: string;
  completedAt?: string;
  shiftId: string;
}

export interface OrderState {
  currentOrder: Order | null;
  orderItems: OrderItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  paymentModalOpen: boolean;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  cashReceived: number;
  change: number;
}

const initialState: OrderState = {
  currentOrder: null,
  orderItems: [],
  orders: [],
  loading: false,
  error: null,
  paymentModalOpen: false,
  paymentStatus: 'idle',
  cashReceived: 0,
  change: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // 訂單項目相關
    addItem: (state, action: PayloadAction<OrderItem>) => {
      // 尋找是否有相同項目
      const existingItemIndex = state.orderItems.findIndex(
        item => item.itemId === action.payload.itemId && 
                JSON.stringify(item.options) === JSON.stringify(action.payload.options)
      );
      
      if (existingItemIndex >= 0) {
        // 如果有相同項目，增加數量
        state.orderItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // 否則添加新項目
        state.orderItems.push(action.payload);
      }
    },
    updateItem: (state, action: PayloadAction<{ index: number; item: OrderItem }>) => {
      state.orderItems[action.payload.index] = action.payload.item;
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.orderItems.splice(action.payload, 1);
    },
    clearItems: (state) => {
      state.orderItems = [];
    },
    
    // 訂單相關
    setOrderType: (state, action: PayloadAction<{ orderType: 'dine_in' | 'takeout'; tableNumber?: string }>) => {
      state.currentOrder = {
        ...state.currentOrder as Order,
        orderType: action.payload.orderType,
        tableNumber: action.payload.tableNumber,
      };
    },
    
    // 付款相關
    openPaymentModal: (state) => {
      state.paymentModalOpen = true;
      state.paymentStatus = 'idle';
      state.cashReceived = 0;
      state.change = 0;
    },
    closePaymentModal: (state) => {
      state.paymentModalOpen = false;
    },
    setCashReceived: (state, action: PayloadAction<number>) => {
      state.cashReceived = action.payload;
      if (state.currentOrder) {
        state.change = Math.max(0, state.cashReceived - state.currentOrder.totalAmount);
      }
    },
    
    // API 相關
    createOrderRequest: (state, action: PayloadAction<{
      orderType: 'dine_in' | 'takeout';
      tableNumber?: string;
      paymentMethod: 'cash' | 'card' | 'other';
      cashReceived?: number;
    }>) => {
      state.loading = true;
      state.error = null;
      state.paymentStatus = 'processing';
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
      state.orderItems = [];
      state.orders.unshift(action.payload);
      state.loading = false;
      state.paymentStatus = 'success';
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.paymentStatus = 'error';
    },
    fetchOrdersRequest: (state, action: PayloadAction<{ shiftId?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderItems = [];
      state.paymentModalOpen = false;
      state.paymentStatus = 'idle';
      state.cashReceived = 0;
      state.change = 0;
    },
  },
});

export const {
  addItem,
  updateItem,
  removeItem,
  clearItems,
  setOrderType,
  openPaymentModal,
  closePaymentModal,
  setCashReceived,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  resetCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer; 