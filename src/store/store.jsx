import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import navigationReducer from './navigationSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    navigation: navigationReducer,
  },
});

export default store;
