import { createAsyncThunk } from '@reduxjs/toolkit';
import { Collection, CreateCollectionData } from '../../types';
import { 
  fetchCollections, 
  fetchPublicCollections, 
  fetchUserCollections,
  createCollection 
} from '../../firebase/firebaseService';

export const fetchCollectionsThunk = createAsyncThunk<Collection[]>(
  'collections/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const collections = await fetchCollections();
      return collections;
    } catch (error) {
      return rejectWithValue('Error fetching collections');
    }
  }
);

export const fetchPublicCollectionsThunk = createAsyncThunk<Collection[]>(
  'collections/fetchPublicCollections',
  async (_, { rejectWithValue }) => {
    try {
      const collections = await fetchPublicCollections();
      return collections;
    } catch (error) {
      return rejectWithValue('Error fetching public collections');
    }
  }
);

export const fetchUserCollectionsThunk = createAsyncThunk<Collection[], string>(
  'collections/fetchUserCollections',
  async (userId, { rejectWithValue }) => {
    try {
      const collections = await fetchUserCollections(userId);
      return collections;
    } catch (error) {
      return rejectWithValue('Error fetching user collections');
    }
  }
);

export const createCollectionThunk = createAsyncThunk<
  Collection | null,
  { collectionData: CreateCollectionData; userId: string }
>(
  'collections/createCollection',
  async ({ collectionData, userId }, { rejectWithValue }) => {
    try {
      const collectionId = await createCollection(collectionData, userId);
      
      // Возвращаем созданную коллекцию с ID
      const now = new Date().toISOString();
      const newCollection: Collection = {
        id: collectionId,
        ...collectionData,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      };
      
      return newCollection;
    } catch (error) {
      return rejectWithValue('Failed to create collection');
    }
  }
);
