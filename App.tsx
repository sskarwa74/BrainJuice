import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MapView from './components/MapView';
import { useGeolocation } from './hooks/useGeolocation';
import type { GeolocationState, MapSource, MarkerData } from './types';

const App: React.FC = () => {
  const { location, error: geoError } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<GeolocationState | null>(location);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const handleNewLocation = useCallback((source: MapSource) => {
    // A helper to extract lat/lng from a google maps URI
    // e.g. https://www.google.com/maps/search/?api=1&query=25.0766,55.1378
    try {
      const url = new URL(source.uri);
      const query = url.searchParams.get('query');
      if (query) {
        const [lat, lng] = query.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          const newCenter = { latitude: lat, longitude: lng };
          setMapCenter(newCenter);
          setMarkers([{ position: { lat, lng }, title: source.title }]);
          return;
        }
      }
    } catch (e) {
      console.error("Could not parse map URI", e);
    }
    // Fallback if parsing fails - center on Dubai
    setMapCenter({ latitude: 25.1972, longitude: 55.2744 });
    setMarkers([{ position: { lat: 25.1972, lng: 55.2744 }, title: source.title }]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <ChatWindow location={location} geoError={geoError} onNewLocation={handleNewLocation} />
        </div>
        <div className="w-1/2">
          <MapView 
            userLocation={location} 
            center={mapCenter}
            markers={markers}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
