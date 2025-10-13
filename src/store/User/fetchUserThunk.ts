import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Firebase конфигурация
import { UserState } from './userSlice';

// Асинхронный thunk для получения данных пользователя по userID
export const fetchUserData = createAsyncThunk<UserState, string>(
  'user/fetchUserData',
  async (userID, { rejectWithValue }) => {
    try {      
      const userDocRef = doc(db, 'Users', userID);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        
        // Преобразуем joinDate в строку для сериализации
        const result = {
          userID: userData.userID,
          name: userData.name || null,
          surname: userData.surname || null,
          premiumStatus: userData.premiumStatus || null,
          email: userData.email || null,
          profilePicture: userData.profilePicture || null,
          joinDate: userData.joinDate ? userData.joinDate.toDate().toISOString() : null, // конвертация в строку
          ratings: userData.ratings || null,
          wishlist: userData.wishlist || null,
          role: userData.role || null,
          language: userData.language || null,
          colorTheme: userData.colorTheme || null,
        };
        
        return result;
      } else {
        return rejectWithValue('User not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return rejectWithValue('Error fetching user data');
    }
  }
);
