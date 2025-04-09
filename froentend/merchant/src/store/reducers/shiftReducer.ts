import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Shift {
  id: string;
  startTime: string;
  endTime: string | null;
  startUserId: string;
  endUserId: string | null;
  startCashAmount: number;
  endCashAmount: number | null;
  notes: string | null;
  status: 'active' | 'closed';
  totalOrders: number;
  totalSales: number;
}

export interface ShiftState {
  currentShift: Shift | null;
  shifts: Shift[];
  loading: boolean;
  error: string | null;
}

const initialState: ShiftState = {
  currentShift: null,
  shifts: [],
  loading: false,
  error: null,
};

const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    fetchShiftsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchShiftsSuccess: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload;
      state.loading = false;
    },
    fetchShiftsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCurrentShiftRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCurrentShiftSuccess: (state, action: PayloadAction<Shift | null>) => {
      state.currentShift = action.payload;
      state.loading = false;
    },
    fetchCurrentShiftFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    startShiftRequest: (state, _action: PayloadAction<{ startCashAmount: number; notes?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    startShiftSuccess: (state, action: PayloadAction<Shift>) => {
      state.currentShift = action.payload;
      state.shifts.unshift(action.payload);
      state.loading = false;
    },
    startShiftFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    endShiftRequest: (state, _action: PayloadAction<{ endCashAmount: number; notes?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    endShiftSuccess: (state, action: PayloadAction<Shift>) => {
      state.currentShift = null;
      state.shifts = state.shifts.map(shift => 
        shift.id === action.payload.id ? action.payload : shift
      );
      state.loading = false;
    },
    endShiftFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchShiftsRequest,
  fetchShiftsSuccess,
  fetchShiftsFailure,
  fetchCurrentShiftRequest,
  fetchCurrentShiftSuccess,
  fetchCurrentShiftFailure,
  startShiftRequest,
  startShiftSuccess,
  startShiftFailure,
  endShiftRequest,
  endShiftSuccess,
  endShiftFailure,
} = shiftSlice.actions;

export default shiftSlice.reducer; 