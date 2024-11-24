import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LanguageSelector from './languageSelector';
import languageReducer from '../../store/Language/languageSlice';
import { RootState } from '../../store';

// Создаем mockStore с правильной структурой
const mockStore = configureStore({
  reducer: {
    language: languageReducer,
    places: () => ({ places: [], loading: false, error: null }),
    user: () => ({ userData: { name: '', email: '', role: '', colorTheme: '' }, loading: false, error: null }),
    theme: () => ({ theme: 'light' }),
  },
});

export default {
  title: 'Components/LanguageSelector',
  component: LanguageSelector,
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = (args) => <LanguageSelector {...args} />;

export const Russian = Template.bind({});
