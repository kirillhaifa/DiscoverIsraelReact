import { createSelector } from 'reselect';
import { RootState } from '../../store';
import { UserState } from './userSlice';

// Базовый селектор для состояния пользователя
const selectUserSlice = (state: RootState) => state.user;

// Селектор для `userData`
export const selectUserData = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.userData
);

// Селектор для `loading`
export const selectUserLoading = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.loading
);

// Селектор для `error`
export const selectUserError = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.error
);

// Селектор для `userID`
export const selectUserID = createSelector(
  [selectUserData],
  (userData) => userData?.userID || null
);

// Селектор для имени пользователя
export const selectUserName = createSelector(
  [selectUserData],
  (userData) => userData?.name || null
);

// Селектор для фамилии пользователя
export const selectUserSurname = createSelector(
  [selectUserData],
  (userData) => userData?.surname || null
);

// Селектор для email
export const selectUserEmail = createSelector(
  [selectUserData],
  (userData) => userData?.email || null
);

// Селектор для статуса premium
export const selectUserPremiumStatus = createSelector(
  [selectUserData],
  (userData) => userData?.premiumStatus || false
);

// Селектор для аватарки пользователя
export const selectUserProfilePicture = createSelector(
  [selectUserData],
  (userData) => userData?.profilePicture || null
);

// Селектор для даты регистрации
export const selectUserJoinDate = createSelector(
  [selectUserData],
  (userData) => userData?.joinDate || null
);

// Селектор для `ratings`
export const selectUserRatings = createSelector(
  [selectUserData],
  (userData) => userData?.ratings || []
);

// Селектор для `wishlist`
export const selectUserWishlist = createSelector(
  [selectUserData],
  (userData) => userData?.wishlist || []
);

// Селектор для роли пользователя
export const selectUserRole = createSelector(
  [selectUserData],
  (userData) => userData?.role || null
);

// Селектор для языка интерфейса
export const selectUserLanguage = createSelector(
  [selectUserData],
  (userData) => userData?.language || 'en' // Значение по умолчанию — английский
);

// Селектор для темы интерфейса
export const selectUserColorTheme = createSelector(
  [selectUserData],
  (userData) => userData?.colorTheme || 'light' // Значение по умолчанию — светлая тема
);
