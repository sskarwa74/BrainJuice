import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, GeolocationState, MapSource } from '../types';
import { ChatRole } from '../types';
import { getChatResponse } from '../services/geminiService';
import ChatMessage from './ChatMessage';
import SuggestionChips from './SuggestionChips';
import { SendIcon, LocationIcon } from './Icons';

interface ChatWindowProps {
  location: GeolocationState | null;
  geoError: string | null;
  onNewLocation: (source: MapSource) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ location, geoError, onNewLocation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: ChatRole.AI,
      text: 'Hello! I am Lumir, your personal real estate advisor. How can I help you explore the Dubai property market today?',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: ChatRole.USER, text: prompt };
    const loadingMessage: Message = { id: (Date.now() + 1).toString(), role: ChatRole.AI, text: '', isLoading: true };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');

    try {
      const { text, sources } = await getChatResponse(prompt, location);
      const aiMessage: Message = { id: (Date.now() + 2).toString(), role: ChatRole.AI, text, sources };
      setMessages(prev => [...prev.slice(0, -1), aiMessage]);

      if (sources && sources.length > 0) {
        onNewLocation(sources[0]); // Update map with the first location found
      }
    } catch (error) {
      console.error('Error fetching response from Gemini:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: ChatRole.AI,
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    }
  }, [location, onNewLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const initialPrompts = [
    'Why invest in Dubai?',
    'Show me apartments near Dubai Marina',
    'What are my legal rights as a buyer?',
    'Compare Dubai with the London market',
  ];

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} onSourceClick={onNewLocation} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length <= 1 && <SuggestionChips prompts={initialPrompts} onChipClick={handleSend} />}

      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about properties, communities, or market trends..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-cyan-500 text-white rounded-full p-3 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
         {geoError && (
          <p className="text-xs text-red-400 mt-2 text-center flex items-center justify-center">
             <LocationIcon className="w-3 h-3 mr-1"/> {geoError} Location features will be unavailable.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;