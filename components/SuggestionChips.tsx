
import React from 'react';

interface SuggestionChipsProps {
  prompts: string[];
  onChipClick: (prompt: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ prompts, onChipClick }) => {
  return (
    <div className="px-4 pb-2">
        <p className="text-sm text-gray-400 mb-3 px-2">Try asking:</p>
        <div className="flex flex-wrap gap-2 px-2">
        {prompts.map((prompt, index) => (
            <button
            key={index}
            onClick={() => onChipClick(prompt)}
            className="bg-gray-700 text-gray-200 text-sm px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
            >
            {prompt}
            </button>
        ))}
        </div>
    </div>
  );
};

export default SuggestionChips;
