import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThemeSelector from './themeToggle';
import themeReducer from '../../store/ColorScheme/themeSlice';
import userReducer from '../../store/User/userSlice';

// Создаем моковый Redux Store
const createMockStore = (theme: string, userProfileTheme: string) =>
  configureStore({
    reducer: {
      theme: themeReducer,
      user: userReducer,
    },
    preloadedState: {
      theme: { theme }, // Текущая тема
      user: { userData: { colorTheme: userProfileTheme } }, // Тема из профиля пользователя
    },
  });

export default {
  title: 'Components/ThemeSelector',
  component: ThemeSelector,
  decorators: [
    (Story, context) => {
      const { theme = 'light', userProfileTheme = 'dark' } = context.args; // Дефолтные значения для тем
      const store = createMockStore(theme, userProfileTheme);
      document.body.style.fontFamily = 'Jost, sans-serif';

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

const Template = (args) => <ThemeSelector {...args} />;

export const Default = Template.bind({});
Default.args = {
  theme: 'light',
  userProfileTheme: 'dark',
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  theme: 'dark',
  userProfileTheme: 'dark',
};

export const LightTheme = Template.bind({});
LightTheme.args = {
  theme: 'light',
  userProfileTheme: 'light',
};

export const SystemTheme = Template.bind({});
SystemTheme.args = {
  theme: 'system',
  userProfileTheme: 'light',
};
