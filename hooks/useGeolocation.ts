import { useState, useEffect } from 'react';
import type { GeolocationState } from '../types';

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    };

    const onError = (error: GeolocationPositionError) => {
      setError(`Geolocation error: ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    });
  }, []);

  return { location, error };
};