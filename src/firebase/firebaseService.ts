import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Place, uploadPlace } from '../types';
import apiClient from '../utils/apiClient';

/**
 * Нормализатор: конвертирует старый формат Firestore (parameters: {hiking:true})
 * в новый (tags: ['hiking']). Работает в обе стороны — если уже есть tags, не трогает.
 * Убрать когда все документы будут смигрированы на бэкенде.
 */
function normalizePlace(data: any, id: string): Place {
  let tags: string[] = data.tags ?? [];
  if (tags.length === 0 && data.parameters && typeof data.parameters === 'object') {
    tags = Object.entries(data.parameters)
      .filter(([, v]) => v === true)
      .map(([k]) => k);
  }
  return {
    ...data,
    id,
    tags,
    religions: data.religions ?? [],
  } as Place;
}

// Функция для получения объектов с добавлением их идентификаторов
export const fetchPlaces = async (): Promise<Place[]> => {
  const placesCol = collection(db, 'places');
  const placeSnapshot = await getDocs(placesCol);

  const placeList = placeSnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Place, 'id'>;
    return normalizePlace(data, doc.id);
  });
  return placeList;
};

// Функция для добавления одного места в коллекцию "places"
export async function addPlaceToCollection(place: Place) {
  const placesCollection = collection(db, 'places');
  try {
    const docRef = await addDoc(placesCollection, place);
  } catch (e) {
    console.error('Error adding place: ', e);
  }
}

export async function fetchPlacesInRange(
  minNumber: number,
  maxNumber: number,
): Promise<Place[]> {
  const placesCollection = collection(db, 'places');

  // Создаём запрос с фильтрацией по полю "number" в заданных пределах
  const q = query(
    placesCollection,
    where('number', '>=', minNumber),
    where('number', '<=', maxNumber),
  );

  try {
    const placesSnapshot = await getDocs(q);
    const placesList = placesSnapshot.docs.map((doc) => doc.data() as Place);
    return placesList;
  } catch (e) {
    console.error('Error fetching places: ', e);
    return [];
  }
}

// Функция для редактирования определенных полей объекта в Firestore
export const editPlaceField = async (
  id: string,
  updatedFields: Partial<Record<string, any>>,
): Promise<void> => {
  try {
    // Получаем ссылку на документ с использованием id места
    const placeRef = doc(db, 'places', id);

    // Обновляем только переданные поля
    await updateDoc(placeRef, updatedFields);

  } catch (e) {
    console.error('Error updating place: ', e);
  }
};

export const uploadPlaceToFirestore = async (placeData: uploadPlace) => {
  try {
    const docRef = await addDoc(collection(db, 'places'), placeData);

    // Теперь вы можете обновить объект, добавив сгенерированный id:
    placeData.id = docRef.id;

    // Если нужно обновить данные с новым id, вы можете сделать это.
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

// Функция для получения объекта по Id
export const fetchPlaceById = async (id: string): Promise<Place | null> => {
  try {
    // Получаем ссылку на документ с использованием id места
    const placeRef = doc(db, 'places', id);

    // Получаем данные документа
    const placeSnapshot = await getDoc(placeRef);

    if (placeSnapshot.exists()) {
      const data = placeSnapshot.data();
      return normalizePlace(data, placeSnapshot.id);
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error fetching place by ID: ', e);
    return null;
  }
};


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

