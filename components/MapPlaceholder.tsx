import React from 'react';
import { MapIcon } from './Icons';

interface MapPlaceholderProps {
  status: 'loading' | 'error' | 'initial';
  message?: string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ status, message }) => {
  let content;

  switch (status) {
    case 'loading':
      content = (
        <>
          <div className="w-12 h-12 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading Map...</p>
        </>
      );
      break;
    case 'error':
      content = (
        <div className="text-center px-4">
          <MapIcon className="w-16 h-16 text-red-400 mx-auto" />
          <p className="mt-4 text-red-400 font-semibold">Map Configuration Error</p>
          <p className="mt-2 text-sm text-gray-300 max-w-md mx-auto">
            The application's API key is not authorized to use Google Maps. This is a configuration issue with the Google Cloud project.
          </p>
          <div className="mt-4 text-xs text-gray-400 bg-gray-700/50 p-3 rounded-lg max-w-md mx-auto">
            <p className="font-bold">Action Required:</p>
            <p className="mt-1">The <strong>"Maps JavaScript API"</strong> service must be enabled for the API key being used.</p>
            <a 
              href="https://developers.google.com/maps/documentation/javascript/error-messages#invalid-key-map-error" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block text-cyan-400 hover:text-cyan-300 underline"
            >
              Click here for Google's instructions
            </a>
          </div>
        </div>
      );
      break;
    case 'initial':
    default:
      content = (
        <>
          <MapIcon className="w-16 h-16 text-gray-500" />
          <p className="mt-4 text-gray-400">Ask for a location to see it on the map.</p>
        </>
      );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
      {content}
    </div>
  );
};

export default MapPlaceholder;