import React from 'react';
import type { Message, MapSource } from '../types';
import { ChatRole } from '../types';
import { UserIcon, BotIcon } from './Icons';
import GroundingSources from './GroundingSources';

// Declares the 'marked' library as a global variable available from the CDN script.
declare var marked: { parse: (markdown: string) => string };

interface ChatMessageProps {
  message: Message;
  onSourceClick?: (source: MapSource) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSourceClick }) => {
  const isUser = message.role === ChatRole.USER;

  const LoadingIndicator = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
    </div>
  );

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <BotIcon className="w-6 h-6 text-cyan-400" />
        </div>
      )}
      <div className={`flex flex-col max-w-lg ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-5 py-3 rounded-2xl ${
            isUser
              ? 'bg-cyan-500 text-white rounded-br-none'
              : 'bg-gray-700 text-gray-200 rounded-bl-none'
          }`}
        >
          {message.isLoading ? <LoadingIndicator /> : (
            <div 
              className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
              dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }} 
            />
          )}
        </div>
        {!isUser && message.sources && message.sources.length > 0 && onSourceClick && (
          <GroundingSources sources={message.sources} onSourceClick={onSourceClick} />
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;