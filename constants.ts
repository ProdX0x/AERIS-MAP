
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
    description: 'A bustling aerial transport hub and commercial district, featuring advanced anti-gravity platforms and holographic advertisements.',
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
    name: 'Quantum Arena NYC',
    address: 'Sector 4, Manhattan Grid',
    description: 'The premier venue for holographic sports and quantum computing exhibitions in the heart of New York.',
    category: 'Entertainment',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    distance: '1.2 km away',
    imageUrl: 'https://picsum.photos/id/142/600/400',
    rating: 4.9,
    tags: ['Sports', 'Holo', 'Arena']
  },
  {
    id: 'p4',
    name: 'Lumière Tower Paris',
    address: 'Champ de Mars, Paris Sector 1',
    description: 'The iconic iron lady reimagined with bioluminescent plating, serving as the central node for European data streams.',
    category: 'Culture',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    distance: '8,900 km away',
    imageUrl: 'https://picsum.photos/id/403/600/400',
    rating: 4.7,
    tags: ['Landmark', 'Light', 'History']
  },
  // DUPLICATE PLACE NEAR PARIS FOR CLUSTERING TEST
  {
    id: 'p4_dup',
    name: 'Paris Cyber Café',
    address: 'Near Eiffel Tower, Paris',
    description: 'A cozy underground spot for netrunners and data brokers.',
    category: 'Entertainment',
    coordinates: { lat: 48.8600, lng: 2.3500 }, // Very close to p4
    distance: '8,900 km away',
    imageUrl: 'https://picsum.photos/id/405/600/400',
    rating: 4.3,
    tags: ['Cafe', 'Cyber', 'Hangout']
  },
  {
    id: 'p5',
    name: 'Red Square Citadel',
    address: 'Moscow Central District',
    description: 'A fusion of historic architecture and modern digital defense systems.',
    category: 'Culture',
    coordinates: { lat: 55.7558, lng: 37.6173 },
    distance: '10,200 km away',
    imageUrl: 'https://picsum.photos/id/352/600/400',
    rating: 4.6,
    tags: ['History', 'Cyber', 'Plaza']
  },
  {
    id: 'p6',
    name: 'Shibuya Crossing Prime',
    address: 'Shibuya, Tokyo',
    description: 'The busiest intersection in the world, now fully augmented with overhead 3D projections.',
    category: 'Cyber',
    coordinates: { lat: 35.6580, lng: 139.7016 },
    distance: '9,700 km away',
    imageUrl: 'https://picsum.photos/id/452/600/400',
    rating: 5.0,
    tags: ['Cyber', 'Neon', 'Crowd']
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
  {
    id: 'e5',
    title: 'Neon Nights Cyber Race',
    locationName: 'Tokyo, Japan',
    distance: '9,700 km',
    startTime: '23:00',
    status: 'UPCOMING',
    imageUrl: 'https://picsum.photos/id/452/800/400',
    category: 'Sports'
  },
  {
    id: 'e6',
    title: 'Manhattan Holo-Art Expo',
    locationName: 'New York, USA',
    distance: '5,800 km',
    startTime: '10:00',
    status: 'LIVE',
    imageUrl: 'https://picsum.photos/id/234/800/400',
    category: 'Art'
  },
  {
    id: 'e7',
    title: 'Eiffel Tower Light Symphony',
    locationName: 'Paris, France',
    distance: '8,900 km',
    startTime: '21:00',
    status: 'UPCOMING',
    imageUrl: 'https://picsum.photos/id/403/800/400',
    category: 'Entertainment'
  },
  {
    id: 'e8',
    title: 'Red Square Digital Parade',
    locationName: 'Moscow, Russia',
    distance: '10,200 km',
    startTime: 'Tomorrow',
    status: 'UPCOMING',
    imageUrl: 'https://picsum.photos/id/352/800/400',
    category: 'Culture'
  }
];