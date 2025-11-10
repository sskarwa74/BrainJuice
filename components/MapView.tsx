import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import MapPlaceholder from './MapPlaceholder';
import type { GeolocationState, MarkerData } from '../types';

interface MapViewProps {
  userLocation: GeolocationState | null;
  center: GeolocationState | null;
  markers: MarkerData[];
}

// FIX: Replaced google.maps.MapTypeStyle[] with any[] to resolve missing 'google' namespace error.
const mapStyles: any[] = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const DUBAI_CENTER = { lat: 25.2048, lng: 55.2708 };

const MapView: React.FC<MapViewProps> = ({ userLocation, center, markers }) => {
  const { isLoaded, loadError } = useGoogleMapsApi();
  const mapRef = useRef<HTMLDivElement>(null);
  // FIX: Replaced google.maps.Map with any to resolve missing 'google' namespace error.
  const [map, setMap] = useState<any | null>(null);
  // FIX: Replaced google.maps.marker.AdvancedMarkerElement[] with any[] to resolve missing 'google' namespace error.
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const initialCenter = userLocation 
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : DUBAI_CENTER;

      // FIX: Cast window to any to access google.maps, which is loaded from a script.
      const newMap = new (window as any).google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 12,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMap(newMap);
    }
  }, [isLoaded, map, userLocation]);

  // Update map center
  useEffect(() => {
    if (map && center) {
      map.panTo({ lat: center.latitude, lng: center.longitude });
      map.setZoom(15);
    }
  }, [map, center]);

  // Update markers
  useEffect(() => {
    if (map) {
      // Clear existing markers
      mapMarkers.forEach(marker => (marker.map = null));
      setMapMarkers([]);

      // FIX: Replaced google.maps.marker.AdvancedMarkerElement[] with any[] to resolve missing 'google' namespace error.
      const newMarkers: any[] = [];
      markers.forEach(markerData => {
        // FIX: Cast window to any to access google.maps, which is loaded from a script.
        const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({
          map,
          position: markerData.position,
          title: markerData.title,
        });
        newMarkers.push(marker);
      });
      setMapMarkers(newMarkers);
    }
  }, [map, markers]);


  if (loadError) {
    return <MapPlaceholder status="error" message={loadError.message} />;
  }

  if (!isLoaded) {
    return <MapPlaceholder status="loading" />;
  }

  if (!center && markers.length === 0 && !userLocation) {
      return <MapPlaceholder status="initial" />;
  }

  return <div ref={mapRef} className="w-full h-full" />;
};

export default MapView;
