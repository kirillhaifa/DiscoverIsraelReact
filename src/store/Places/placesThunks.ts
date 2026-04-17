// src/features/placesThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Place } from '../../types';
import { shuffleArray } from '../../utils/functions';
import apiClient from '../../utils/apiClient';


export const fetchPlacesThunk = createAsyncThunk<Place[]>(
  'places/fetchPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{ data: Place[] }>('/api/places');
      return shuffleArray(data.data);
    } catch (error) {
      return rejectWithValue('Error fetching places');
    }
  }
);

// Асинхронный thunk для добавления нового места (admin only)
export const addPlaceThunk = createAsyncThunk(
  'places/addPlace',
  async (newPlace: Omit<Place, 'id'>, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/api/places', newPlace);
      return data.data as Place;
    } catch (error) {
      return rejectWithValue('Failed to add new place');
    }
  }
);