import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';
import { Rating } from './ratingsSlice';

export const fetchRatingsThunk = createAsyncThunk<Rating[]>(
  'ratings/fetchMyRatings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/api/ratings/my');
      return data.data as Rating[];
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return rejectWithValue('Error fetching ratings');
    }
  },
);
