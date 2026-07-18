import { createSlice } from '@reduxjs/toolkit';

const initialState = { user: null, accessToken: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken || null;
    },
    clearSession: () => initialState,
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
