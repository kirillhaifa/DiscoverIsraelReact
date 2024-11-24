// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: null // null указывает, что тема не выбрана пользователем
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload; // 'light' или 'dark'
    },
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
