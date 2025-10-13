import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserData } from './fetchUserThunk';
import { updateUserThunk } from './updateUserThunk';

export interface Rating {
  placeId: string;
  rating: number;
}

export interface UserState {
  userID: string | null;
  name: string | null;
  surname: string | null;
  premiumStatus: boolean | null;
  email: string | null;
  profilePicture: string | null;
  joinDate: string | null;
  ratings: Rating[] | null;
  wishlist: string[] | null;
  role: string | null;
  language: string | null;
  colorTheme: string | null;
}

// Структура состояния
interface UserSliceState {
  userData: UserState | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: UserSliceState = {
  userData: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<UserState>) => {
          state.userData = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
        console.error('fetchUserData rejected:', action.error.message);
        console.error('Full error:', action);
      });

    // Обработка обновления данных пользователя
    builder.addCase(updateUserThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateUserThunk.fulfilled,
      (state, action: PayloadAction<Partial<UserState>>) => {
        state.loading = false;
        // Обновляем информацию в userData только для тех полей, которые были изменены
        state.userData = {
          ...state.userData,
          ...action.payload,
        } as UserState;
        state.error = null;
      },
    );
  },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
