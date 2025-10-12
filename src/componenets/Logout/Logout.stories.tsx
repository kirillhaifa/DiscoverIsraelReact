import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Logout from './logout';
import languageReducer from '../../store/Language/languageSlice';
import '../../../public/Fonts/fonts.scss'; // Подключаем шрифты


// Создаем моковый store с правильной структурой состояния
const createMockStore = (language: string) =>
  configureStore({
    reducer: {
      language: languageReducer,
      places: () => ({ places: [], loading: false, error: null }),
      user: () => ({ userData: { name: '', email: '', role: '', colorTheme: '' }, loading: false, error: null }),
      theme: () => ({ theme: 'light' }),
    },
    preloadedState: {
      language: { language }, // Передаем объект, соответствующий ожиданиям languageReducer
    },
  });

export default {
  title: 'Components/Logout',
  component: Logout,
  decorators: [
    (Story, context) => {
      const language = context.args.language || 'en'; // Язык по умолчанию "en"
      const store = createMockStore(language);

      // Устанавливаем шрифт глобально для body
      document.body.style.fontFamily = 'Jost, sans-serif';

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

const Template = (args) => <Logout {...args} />;

export const Default = Template.bind({});
Default.args = {
  language: 'en',
};

export const RussianLanguage = Template.bind({});
RussianLanguage.args = {
  language: 'ru',
};

export const HebrewLanguage = Template.bind({});
HebrewLanguage.args = {
  language: 'he',
};
