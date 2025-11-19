import { useState, useCallback } from 'react';
import { NavTab, Place, Event } from '../types';
import { MOCK_PLACES, MOCK_EVENTS } from '../constants';

export const useAppViewModel = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>(NavTab.MAP);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [arMode, setArMode] = useState(false);

  // Memoized data access
  const places = MOCK_PLACES;
  const events = MOCK_EVENTS;

  const selectedPlace = places.find(p => p.id === selectedPlaceId) || null;

  const handleTabChange = useCallback((tab: NavTab) => {
    setCurrentTab(tab);
    // Clear specific view states when switching main tabs if needed
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
    toggleArMode
  };
};
