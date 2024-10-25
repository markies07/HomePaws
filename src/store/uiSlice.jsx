import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isLoginOpen: false,
    isCreateOpen: false,
    isLogin: false,
    isDogOpen: false,
  },
  reducers: {
    toggleLogin(state) {
      state.isLoginOpen = !state.isLoginOpen;
    },
    closeLogin(state) {
      state.isLoginOpen = false;
    },
    toggleCreate(state) {
      state.isCreateOpen = !state.isCreateOpen;
    },
    closeCreate(state) {
      state.isCreateOpen = false;
    },
    toggleIsLogin(state) {
      state.isLogin = !state.isLogin;
    },
    closeIsLogin(state) {
      state.isLogin = false;
    },
    toggleDog(state) {
      state.isDogOpen = !state.isDogOpen;
    },
    closeDog(state) {
      state.isDogOpen = false;
    },
  },
});

export const {
  toggleLogin,
  closeLogin,
  toggleCreate,
  closeCreate,
  toggleIsLogin,
  closeIsLogin,
  toggleDog,
  closeDog,
} = uiSlice.actions;

export default uiSlice.reducer;
