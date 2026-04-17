import { createAsyncThunk } from '@reduxjs/toolkit';
import { Collection, CreateCollectionData } from '../../types';
import apiClient from '../../utils/apiClient';

export const fetchCollectionsThunk = createAsyncThunk<Collection[]>(
  'collections/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/api/collections');
      return data.data as Collection[];
    } catch (error) {
      return rejectWithValue('Error fetching collections');
    }
  }
);

export const createCollectionThunk = createAsyncThunk<
  Collection | null,
  { collectionData: CreateCollectionData; userId: string }
>(
  'collections/createCollection',
  async ({ collectionData }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/api/collections', collectionData);
      return data.data as Collection;
    } catch (error) {
      return rejectWithValue('Failed to create collection');
    }
  }
);
