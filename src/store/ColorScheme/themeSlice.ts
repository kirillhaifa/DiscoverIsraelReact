// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Функция для загрузки темы из localStorage
const loadThemeFromStorage = () => {
  try {
    const savedTheme = localStorage.getItem('userTheme');
    return savedTheme || null;
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return null;
  }
};

// Функция для сохранения темы в localStorage
const saveThemeToStorage = (theme: string | null) => {
  try {
    if (theme) {
      localStorage.setItem('userTheme', theme);
    } else {
      localStorage.removeItem('userTheme');
    }
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
};

const initialState = {
  theme: loadThemeFromStorage() // Загружаем тему из localStorage при инициализации
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload; // 'light' или 'dark'
      saveThemeToStorage(action.payload); // Сохраняем в localStorage
      console.log('Theme set to:', action.payload);
    },
    clearTheme: (state) => {
      state.theme = null;
      saveThemeToStorage(null);
    }
  }
});

export const { setTheme, clearTheme } = themeSlice.actions;
export default themeSlice.reducer;
