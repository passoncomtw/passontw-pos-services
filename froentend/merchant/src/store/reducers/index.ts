import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import shiftReducer from './shiftReducer';
import orderReducer from './orderReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  shift: shiftReducer,
  order: orderReducer,
});

export default rootReducer; 