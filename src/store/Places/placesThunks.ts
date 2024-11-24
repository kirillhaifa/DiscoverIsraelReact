// src/features/placesThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Place, uploadPlace } from '../../types';
import { fetchPlaces } from '../../firebase/firebaseService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { shuffleArray } from '../../utils/functions';


export const fetchPlacesThunk = createAsyncThunk<Place[]>(
  'places/fetchPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const places = await fetchPlaces();
      const shuffledPlaces = shuffleArray(places as Place[]); // Перемешиваем массив
      return shuffledPlaces; // Возвращаем перемешанный массив
    } catch (error) {
      return rejectWithValue('Error fetching places');
    }
  }
);

// Асинхронный thunk для добавления нового места
export const addPlaceThunk = createAsyncThunk(
  'places/addPlace',
  async (newPlace: uploadPlace, { rejectWithValue }) => {
    try {
      // Создаем новый документ с автоматически сгенерированным ID
      const placeRef = doc(db, 'Places'); // Создаем новый документ в коллекции 'Places'
      // newPlace.id = placeRef.id; // Присваиваем новый ID объекту newPlace

      // Добавляем новое место в Firestore
      await setDoc(placeRef, newPlace);

      return newPlace; // Возвращаем новое место
    } catch (error) {
      return rejectWithValue('Failed to add new place');
    }
  }
);