import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';
import { auth } from '../../../firebaseConfig';
import { UserState } from './userSlice';

// Получает данные пользователя через бэкенд API
export const fetchUserData = createAsyncThunk<UserState, string>(
  'user/fetchUserData',
  async (_userID, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/api/users/me');
      const userData = data.data;
      const firebaseUser = auth.currentUser;

      return {
        userID: userData.userID,
        name: userData.name || null,
        surname: userData.surname || null,
        premiumStatus: userData.premiumStatus || null,
        email: userData.email || firebaseUser?.email || null,
        profilePicture: userData.profilePicture || firebaseUser?.photoURL || null,
        joinDate: userData.joinDate ?? null,
        ratings: userData.ratings || null,
        wishlist: userData.wishlist || null,
        role: userData.role || null,
        language: userData.language || null,
        colorTheme: userData.colorTheme || null,
      } as UserState;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return rejectWithValue('Error fetching user data');
    }
  }
);


