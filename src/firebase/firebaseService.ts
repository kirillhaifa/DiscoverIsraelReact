import { Place } from '../types';
import apiClient from '../utils/apiClient';

// Функция для обновления или добавления оценки
export const submitRating = async (_userId: string, placeId: string, rating: number) => {
  try {
    await apiClient.post('/api/ratings', { placeId, rating });
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

// Функция для удаления оценки пользователя
export const deleteRating = async (_userId: string, placeId: string) => {
  try {
    await apiClient.delete(`/api/ratings/${placeId}`);
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
};

// Функции вишлиста (сердечко) — через API
export const addToWishlist = async (_userId: string, placeId: string) => {
  try {
    await apiClient.post(`/api/users/me/wishlist/${placeId}`);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Обратная совместимость: старые названия остаются рабочими пока не обновлены все компоненты
export const addPlaceToPlans = addToWishlist;

export const removeFromWishlist = async (_userId: string, placeId: string) => {
  try {
    await apiClient.delete(`/api/users/me/wishlist/${placeId}`);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const removePlaceFromPlans = removeFromWishlist;

export const checkPlaceInWishlist = async (_userId: string, placeId: string): Promise<boolean> => {
  try {
    const { data } = await apiClient.get('/api/users/me/wishlist');
    const places: { id: string }[] = data.data;
    return places.some((p) => p.id === placeId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

export const checkPlaceInPlans = checkPlaceInWishlist;

export const fetchWishlistPlaces = async (_userId: string): Promise<Place[]> => {
  try {
    const { data } = await apiClient.get('/api/users/me/wishlist');
    return data.data as Place[];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

export const fetchPlannedPlaces = fetchWishlistPlaces;

