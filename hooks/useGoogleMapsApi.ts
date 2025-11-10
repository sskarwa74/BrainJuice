import { useState, useEffect } from 'react';

const libraries = ['places', 'marker'];

interface GoogleMapsApiState {
  isLoaded: boolean;
  loadError?: Error;
}

export const useGoogleMapsApi = () => {
  const [state, setState] = useState<GoogleMapsApiState>({
    isLoaded: false,
    loadError: undefined,
  });

  useEffect(() => {
    const scriptId = 'google-maps-script';
    
    // Check if script is already loaded or loading
    if ((window as any).google && (window as any).google.maps) {
      setState({ isLoaded: true, loadError: undefined });
      return;
    }
    if (document.getElementById(scriptId)) {
      return;
    }

    // Set up a global error handler for Google Maps authentication failures
    (window as any).gm_authFailure = () => {
      setState({
        isLoaded: false,
        loadError: new Error("Google Maps authentication failed. The provided API key is not valid for the Google Maps JavaScript API. Please ensure the key has the correct permissions enabled in your Google Cloud project."),
      });
    };

    // Prioritize a dedicated React App Google Maps key, then a generic one, and finally fall back to the main API key.
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      const errorMessage = "API key is missing. Please ensure REACT_APP_GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_API_KEY, or API_KEY environment variable is set.";
      console.error(errorMessage);
      setState({
        isLoaded: false,
        loadError: new Error("Configuration issue: API key for Google Maps is missing."),
      });
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    (window as any).initMap = () => {
      setState({ isLoaded: true, loadError: undefined });
      // Clean up auth failure handler on success
      delete (window as any).gm_authFailure;
    };

    script.onerror = () => {
      setState({
        isLoaded: false,
        loadError: new Error('Failed to load Google Maps script. Check network connection.'),
      });
      delete (window as any).initMap;
      delete (window as any).gm_authFailure;
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup global handlers when the component unmounts
      delete (window as any).initMap;
      delete (window as any).gm_authFailure;
    };
  }, []);

  return state;
};
