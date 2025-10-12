import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ProfileButton from './profileButton';
import languageReducer from '../../store/Language/languageSlice';
import '../../../public/Styles/normalizer.module.scss';

// Создаем моковый store с правильной структурой состояния
const createMockStore = (language: string) =>
  configureStore({
    reducer: {
      language: languageReducer,
      places: () => ({ places: [], loading: false, error: null }),
      user: () => ({
        userData: { name: '', email: '', role: '', colorTheme: '' },
        loading: false,
        error: null,
      }),
      theme: () => ({ theme: 'light' }),
    },
    preloadedState: {
      language: { language }, // Передаем объект, соответствующий ожиданиям languageReducer
    },
  });

export default {
  title: 'Components/ProfileButton',
  component: ProfileButton,
  decorators: [
    (Story, context) => {
      const language = context.args.language || 'en'; // Берем язык из аргументов или по умолчанию
      const store = createMockStore(language);

      // Устанавливаем глобальный класс на body для применения стиля шрифта
      document.body.style.fontFamily = 'Jost, sans-serif';

      return (
          <Provider store={store}>
            <MemoryRouter initialEntries={['/profile']}>
              <Story />
            </MemoryRouter>
          </Provider>
      );
    },
  ],
};

const Template = (args) => <ProfileButton {...args} />;

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
