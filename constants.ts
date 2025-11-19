import { Event, Place, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Stéphane Saulnier',
  avatarUrl: 'https://picsum.photos/id/64/200/200',
  stats: {
    visits: 142,
    uploads: 28,
    reputation: 98,
  }
};

export const MOCK_PLACES: Place[] = [
  {
    id: 'p1',
    name: 'Neo-Kyoto Skyport',
    address: '123 Cybernetic Dr, Sector 7G',
    description: 'A bustling aerial transport hub and commercial district, featuring advanced anti-gravity platforms and holographic advertisements. Connects to major global cities and orbital stations.',
    category: 'Transport',
    coordinates: { lat: 35.0116, lng: 135.7681 },
    distance: '2.5 km away',
    imageUrl: 'https://picsum.photos/id/122/600/400',
    rating: 4.8,
    tags: ['Transport', 'Hub', 'Skyline']
  },
  {
    id: 'p2',
    name: 'Echo Park Lake',
    address: '751 Echo Park Ave, Los Angeles',
    description: 'Historic park featuring lotus flowers, swan boats & walking paths, plus skyline views.',
    category: 'Nature',
    coordinates: { lat: 34.0776, lng: -118.2610 },
    distance: '0.5 mi away',
    imageUrl: 'https://picsum.photos/id/10/600/400',
    rating: 4.5,
    tags: ['Nature', 'Water', 'Peaceful']
  },
  {
    id: 'p3',
    name: 'Quantum Arena',
    address: 'Sector 4, Grid 9',
    description: 'The premier venue for holographic sports and quantum computing exhibitions.',
    category: 'Entertainment',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    distance: '1.2 km away',
    imageUrl: 'https://picsum.photos/id/142/600/400',
    rating: 4.9,
    tags: ['Sports', 'Holo', 'Arena']
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Neo-Kyoto Drone Rally',
    locationName: 'Neo-Kyoto Skyport',
    distance: '2.5 km',
    startTime: 'Now',
    status: 'LIVE',
    imageUrl: 'https://picsum.photos/id/230/800/400',
    category: 'Sports'
  },
  {
    id: 'e2',
    title: 'Cosmic Harmony Festival',
    locationName: 'Sector 9 Gardens',
    distance: '12 km',
    startTime: '20:00',
    status: 'UPCOMING',
    imageUrl: 'https://picsum.photos/id/240/800/400',
    category: 'Music'
  },
  {
    id: 'e3',
    title: 'Biodome Exploration',
    locationName: 'Eden Project',
    distance: '87 km',
    startTime: 'Yesterday',
    status: 'RECORDED',
    imageUrl: 'https://picsum.photos/id/250/800/400',
    category: 'Education'
  },
    {
    id: 'e4',
    title: 'FutureScape Music Festival',
    locationName: 'Central Plaza',
    distance: '2.3 km',
    startTime: 'Now',
    status: 'LIVE',
    imageUrl: 'https://picsum.photos/id/342/800/400',
    category: 'Music'
  },
];
