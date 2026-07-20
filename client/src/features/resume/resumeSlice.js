import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: { current: null },
  reducers: {
    setCurrentResume: (state, action) => {
      state.current = action.payload;
    },
    clearCurrentResume: (state) => {
      state.current = null;
    },
  },
});

export const { setCurrentResume, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;
