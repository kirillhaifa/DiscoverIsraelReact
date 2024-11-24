// src/types.ts

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
  parameters: Parameters;
  schedule: Schedule;
  ticketPrice: TicketPrice;
  contact: Contact | null;
  region: string;
  coordinates: [number, number];
  googleMapsLink: string;
  minVisitTime: number;
  favoriteMonths: FavoriteMonths;
}

export interface uploadPlace {
  id?: string;  // Сделаем id опциональным
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
  parameters: Parameters;
  schedule: Schedule;
  ticketPrice: TicketPrice;
  contact: Contact | null;
  region: string;
  coordinates: [number, number];
  googleMapsLink: string;
  minVisitTime: number;
  favoriteMonths: FavoriteMonths;
}

export interface Photo {
  photoName: string;
  photoWay: string;
}

export interface Parameters {
  grill: boolean;
  hiking: boolean;
  view: boolean;
  transport: boolean;
  beach: boolean;
  historical: boolean;
  free: boolean;
  pets: boolean;
  accessible: boolean;
  unesco: boolean;
  nationalPark: boolean;
  kidsFriendly: boolean;
  toilets: boolean;
  parking: boolean;
  drinkingWater: boolean;
  cafe: boolean;
  wifi: boolean;
  mushrooms: boolean;
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