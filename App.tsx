
import React from 'react';
import { useAppViewModel } from './viewmodels/useAppViewModel';
import { NavTab } from './types';
import { MapView } from './views/MapView';
import { EventsView } from './views/EventsView';
import { CreateView } from './views/CreateView';
import { PlaceDetailView } from './views/PlaceDetailView';
import { ARView } from './views/ARView';
import { BottomBar } from './components/Navigation/BottomBar';
import { TopBar } from './components/Navigation/TopBar';
import { User } from 'lucide-react';

const App: React.FC = () => {
  const vm = useAppViewModel();

  const renderContent = () => {
    switch (vm.currentTab) {
      case NavTab.MAP:
        return (
          <MapView 
            places={vm.places} 
            onSelectPlace={vm.selectPlace} 
            onToggleAR={vm.toggleArMode}
          />
        );
      case NavTab.EVENTS:
        return (
          <EventsView 
            events={vm.events} 
            searchQuery={vm.searchQuery} 
            onSearch={vm.filterEvents} 
          />
        );
      case NavTab.CREATE:
        return <CreateView />;
      case NavTab.PROFILE:
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#050b14]">
             <div className="text-center">
               <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
                 <User size={40} className="text-gray-500" />
               </div>
               <h2 className="text-xl font-bold text-white">Stéphane Saulnier</h2>
               <p className="text-gray-500 text-sm">Explorer • Lv. 12</p>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#050b14] overflow-hidden">
      
      {/* Show TopBar only on Map View for cleaner look, or globally */}
      <TopBar />

      {/* Main Content Area */}
      <div className="absolute inset-0 pb-[85px]">
        {renderContent()}
      </div>

      {/* Place Detail Overlay (Modal) */}
      {vm.selectedPlace && (
        <PlaceDetailView 
          place={vm.selectedPlace} 
          onClose={() => vm.selectPlace(null)} 
        />
      )}

      {/* AR Mode Overlay */}
      {vm.arMode && (
        <ARView onExit={vm.toggleArMode} />
      )}

      {/* Bottom Navigation */}
      <BottomBar currentTab={vm.currentTab} onTabChange={vm.handleTabChange} />
    </div>
  );
};

export default App;
