// src/redux/slices/navigationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeTab: 'FindPet',  // Default active tab
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab } = navigationSlice.actions;
export default navigationSlice.reducer;
