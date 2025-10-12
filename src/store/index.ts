import { configureStore } from '@reduxjs/toolkit';
import placesReducer from './Places/placesSlice'; 
import userReducer from '../store/User/userSlice';
import languageReducer from '../store/Language/languageSlice';
import themeReducer from '../store/ColorScheme/themeSlice';
import filtersReducer from './Filters/filtersSlice';
import locationReducer from '../store/Location/locationSlice'
import authPromptReducer from '../store/authPrompt/authPromptSlice'
import collectionsReducer from './Collections/collectionsSlice';

const store = configureStore({
  reducer: {
    places: placesReducer,
    user: userReducer,
    language: languageReducer,
    theme: themeReducer,
    filters: filtersReducer,
    location: locationReducer,
    authPrompt: authPromptReducer,
    collections: collectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
