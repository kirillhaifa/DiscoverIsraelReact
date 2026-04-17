// src/store/User/updateUserThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';
import { UserState } from './userSlice';

export const updateUserThunk = createAsyncThunk(
  'user/updateUserData',
  async (updatedData: Partial<UserState>, { rejectWithValue }) => {
    try {
      // Обновление данных через backend API
      const { data } = await apiClient.patch('/api/users/me', updatedData);
      return data.data as Partial<UserState>;
    } catch (error) {
      return rejectWithValue('Failed to update user data');
    }
  }
);
