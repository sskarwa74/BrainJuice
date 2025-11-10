import React from 'react';
import type { MapSource } from '../types';
import { LinkIcon } from './Icons';

interface GroundingSourcesProps {
  sources: MapSource[];
  onSourceClick: (source: MapSource) => void;
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ sources, onSourceClick }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources from Google Maps:</h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <button
            key={index}
            onClick={() => onSourceClick(source)}
            className="flex items-center text-xs bg-gray-600/50 text-cyan-300 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3 h-3 mr-1.5" />
            {source.title || 'View on map'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroundingSources;