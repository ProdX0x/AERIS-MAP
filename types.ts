// Domain Models

export enum NavTab {
  MAP = 'MAP',
  EVENTS = 'EVENTS',
  CREATE = 'CREATE',
  PROFILE = 'PROFILE'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  description: string;
  category: 'Transport' | 'Culture' | 'Entertainment' | 'Nature' | 'Cyber';
  coordinates: Coordinates;
  distance: string;
  imageUrl: string;
  rating: number;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  locationName: string;
  distance: string;
  startTime: string;
  status: 'LIVE' | 'UPCOMING' | 'RECORDED';
  imageUrl: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  stats: {
    visits: number;
    uploads: number;
    reputation: number;
  };
}
