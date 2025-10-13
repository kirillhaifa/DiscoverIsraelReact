// src/store/User/updateUserThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { UserState } from './userSlice';

export const updateUserThunk = createAsyncThunk(
  'user/updateUserData',
  async (updatedData: Partial<UserState>, { rejectWithValue }) => {
    try {
      const userDocRef = doc(db, 'Users', updatedData.userID as string);
      
      // Обновление данных в Firestore
      await updateDoc(userDocRef, updatedData);
      return updatedData; // Возвращаем обновленные данные

    } catch (error) {
      return rejectWithValue('Failed to update user data');
    }
  }
);
