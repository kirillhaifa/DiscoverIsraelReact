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
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { Place, uploadPlace, Collection, CreateCollectionData } from '../types';

// Функция для получения объектов с добавлением их идентификаторов
export const fetchPlaces = async (): Promise<Place[]> => {
  const placesCol = collection(db, 'places');
  const placeSnapshot = await getDocs(placesCol);

  const placeList = placeSnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Place, 'id'>;
    return { ...data, id: doc.id };
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
      // Если документ существует, возвращаем его данные
      const data = placeSnapshot.data() as Omit<Place, 'id'>;
      return { ...data, id: placeSnapshot.id }; // Добавляем Id документа
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error fetching place by ID: ', e);
    return null;
  }
};


// Функция для обновления или добавления оценки
export const submitRating = async (userId, placeId, rating) => {
  try {
    const userRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User does not exist.');
    }

    const userData = userDoc.data();
    const existingRatingIndex = userData.ratings.findIndex(
      (item) => item.placeId === placeId
    );

    // Если оценка для этого места уже существует, обновляем её
    if (existingRatingIndex >= 0) {
      userData.ratings[existingRatingIndex].rating = rating;
    } else {
      // Если нет, добавляем новую
      userData.ratings.push({ placeId, rating });
    }

    // Обновляем документ с новыми оценками
    await updateDoc(userRef, {
      ratings: userData.ratings,
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

// Функция для удаления оценки пользователя
export const deleteRating = async (userId, placeId) => {
  try {
    const userRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User does not exist.');
    }

    // Удаляем оценку для указанного места
    const updatedRatings = userDoc
      .data()
      .ratings.filter((rating) => rating.placeId !== placeId);

    await updateDoc(userRef, {
      ratings: updatedRatings,
    });

  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
};

// Функции для работы с коллекциями
export const createCollection = async (collectionData: CreateCollectionData, userId: string): Promise<string> => {
  try {
    const now = new Date().toISOString();
    
    const collectionWithMeta: Omit<Collection, 'id'> = {
      ...collectionData,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    };

    const docRef = await addDoc(collection(db, 'collections'), collectionWithMeta);
    return docRef.id;
  } catch (error) {
    console.error('Error creating collection: ', error);
    throw error;
  }
};

export const fetchCollections = async (): Promise<Collection[]> => {
  try {
    const collectionsCol = collection(db, 'collections');
    const collectionSnapshot = await getDocs(collectionsCol);

    const collectionList = collectionSnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Collection, 'id'>;
      return { ...data, id: doc.id };
    });
    return collectionList;
  } catch (error) {
    console.error('Error fetching collections: ', error);
    return [];
  }
};

export const fetchPublicCollections = async (): Promise<Collection[]> => {
  try {
    const collectionsCol = collection(db, 'collections');
    const q = query(collectionsCol, where('isPublic', '==', true));
    const collectionSnapshot = await getDocs(q);

    const collectionList = collectionSnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Collection, 'id'>;
      return { ...data, id: doc.id };
    });
    return collectionList;
  } catch (error) {
    console.error('Error fetching public collections: ', error);
    return [];
  }
};

export const fetchUserCollections = async (userId: string): Promise<Collection[]> => {
  try {
    const collectionsCol = collection(db, 'collections');
    const q = query(collectionsCol, where('createdBy', '==', userId));
    const collectionSnapshot = await getDocs(q);

    const collectionList = collectionSnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Collection, 'id'>;
      return { ...data, id: doc.id };
    });
    return collectionList;
  } catch (error) {
    console.error('Error fetching user collections: ', error);
    return [];
  }
};

