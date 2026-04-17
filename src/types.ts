// src/types.ts

export type Religion =
  | 'jewish'
  | 'christian'
  | 'muslim'
  | 'druze'
  | 'bahai'
  | 'samaritan'
  | 'circassian'
  | 'armenian'
  | 'bedouin'
  | 'secular';

// Все возможные теги места — единственный способ хранить фичи
// Добавить новый фильтр = добавить новую строку сюда + тег на нужные места
export type PlaceTag =
  | 'grill' | 'hiking' | 'view' | 'transport' | 'beach' | 'historical'
  | 'free' | 'pets' | 'accessible' | 'unesco' | 'nationalPark'
  | 'kidsFriendly' | 'toilets' | 'parking' | 'drinkingWater' | 'cafe'
  | 'wifi' | 'mushrooms' | 'bombShelter'
  | (string & {}); // допускаем произвольные теги для будущего расширения

export interface Place {
  id: string; 
  number: number;
  placeName: {
    en: string;
    he: string;
    ru: string;
  };
  shortDescription: {
    en: string;
    he: string;
    ru: string;
  };
  extendedDescription: {
    en: string;
    he: string;
    ru: string;
  };
  photos: Photo[];
  tags: PlaceTag[];         // все фичи места: ['hiking', 'free', 'bombShelter', ...]
  religions: Religion[];    // применимые религии (может быть несколько)
  schedule: Schedule;
  ticketPrice: TicketPrice;
  contact: Contact | null;
  region: string;
  coordinates: [number, number];
  googleMapsLink: string;
  minVisitTime: number;
  favoriteMonths: FavoriteMonths;
  averageRating?: number;   // приходит с бэкенда, не считается на фронте
  ratingsCount?: number;    // кол-во оценок
}

export interface Photo {
  photoName: string;
  photoWay: string;
}

export interface Schedule {
  notes: {
    en: string;
    he: string;
    ru: string;
  };
  summer: SeasonSchedule;
  winter: SeasonSchedule;
}

export interface SeasonSchedule {
  weekdaysAndSaturday: OpeningHours;
  fridayAndHolidaysEve: OpeningHours;
  specialDays?: SpecialDay[];
}

export interface OpeningHours {
  open: string;
  close: string;
}

export interface SpecialDay {
  name: string;
  open: string;
  close: string;
}

export interface TicketPrice {
  adult: string | null;
  child: string | null;
}

export interface Contact {
  phone: string | null;
  website: string | null;
}

export interface FavoriteMonths {
  January: boolean;
  February: boolean;
  March: boolean;
  April: boolean;
  May: boolean;
  June: boolean;
  July: boolean;
  August: boolean;
  September: boolean;
  October: boolean;
  November: boolean;
  December: boolean;
}

// Типы для коллекций
export interface Collection {
  id: string;
  title: {
    ru: string;
    en: string;
    he: string;
  };
  shortDescription: {
    ru: string;
    en: string;
    he: string;
  };
  longDescription: {
    ru: string;
    en: string;
    he: string;
  };
  coverPhoto: string;
  collectionPhotos?: string[]; // Опциональные фото коллекции
  placeIds: string[]; // Массив ID мест
  createdAt: string;
  updatedAt: string;
  createdBy: string; // ID пользователя-создателя
  isPublic: boolean;
}

export interface CreateCollectionData {
  title: {
    ru: string;
    en: string;
    he: string;
  };
  shortDescription: {
    ru: string;
    en: string;
    he: string;
  };
  longDescription: {
    ru: string;
    en: string;
    he: string;
  };
  coverPhoto: string;
  collectionPhotos?: string[];
  placeIds: string[];
  isPublic: boolean;
}