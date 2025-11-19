import { useState, useCallback } from 'react';
import { NavTab, Place, Event } from '../types';
import { MOCK_PLACES, MOCK_EVENTS } from '../constants';

export const useAppViewModel = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>(NavTab.MAP);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [arMode, setArMode] = useState(false);

  // State for Dynamic Data (initialized with Mocks)
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  const selectedPlace = places.find(p => p.id === selectedPlaceId) || null;

  const handleTabChange = useCallback((tab: NavTab) => {
    setCurrentTab(tab);
    if (tab !== NavTab.MAP) {
      setSelectedPlaceId(null);
    }
  }, []);

  const selectPlace = useCallback((id: string | null) => {
    setSelectedPlaceId(id);
  }, []);

  const toggleArMode = useCallback(() => {
    setArMode(prev => !prev);
  }, []);

  const filterEvents = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Logic to create a new event and propagate it to Map (Place) and Feed (Event)
  const publishEvent = useCallback((formData: { title: string; description: string; category: string }) => {
    const newId = `new_${Date.now()}`;
    
    // 1. Create a new Place for the Map/AR
    // We simulate a location near "Paris" for visibility or random coords on the globe
    const randomLat = 48.8566 + (Math.random() - 0.5) * 0.1;
    const randomLng = 2.3522 + (Math.random() - 0.5) * 0.1;

    const newPlace: Place = {
      id: newId,
      name: formData.title,
      address: 'Custom Location • Just Now',
      description: formData.description,
      category: 'Entertainment', // simplified mapping
      coordinates: { lat: randomLat, lng: randomLng },
      distance: '0 km (You)',
      imageUrl: 'https://picsum.photos/seed/' + newId + '/600/400',
      rating: 5.0,
      tags: ['User Content', 'Live', formData.category]
    };

    // 2. Create a new Event for the Feed
    const newEvent: Event = {
      id: newId,
      title: formData.title,
      locationName: 'My Current Location',
      distance: '0 km',
      startTime: 'Just Started',
      status: 'LIVE',
      imageUrl: newPlace.imageUrl,
      category: formData.category
    };

    // 3. Update States
    setPlaces(prev => [...prev, newPlace]);
    setEvents(prev => [newEvent, ...prev]); // Add to top of feed

    // 4. Navigation & Feedback
    setCurrentTab(NavTab.MAP);
    // Automatically select the new place to show it's been created
    setTimeout(() => setSelectedPlaceId(newId), 500);
  }, []);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    currentTab,
    handleTabChange,
    selectedPlace,
    selectPlace,
    places,
    events: filteredEvents,
    searchQuery,
    filterEvents,
    arMode,
    toggleArMode,
    publishEvent
  };
};