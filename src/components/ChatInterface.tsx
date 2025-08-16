import React from 'react';
import { ChatMessage } from '../types';
import { PaperAirplaneIcon, PhotographIcon, XCircleIcon } from './Icons';
import { Spinner } from './Spinner';
import ChatMessageRenderer from './ChatMessageRenderer';
import { CountryMappings } from '../services/countryDataService';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  thinkingText: string;
  welcomeMessage: React.ReactNode;
  onAttachImageClick: () => void;
  attachedImagePreview: string | null;
  onRemoveAttachedImage: () => void;
  isProcessingImage: boolean;
  processingImageText: string;
  inputPlaceholder: string;
  chatError: string | null;
  countryMappings: CountryMappings;
  onCountryClick: (countryName: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  onInputChange,
  onSendMessage,
  isLoading,
  thinkingText,
  welcomeMessage,
  onAttachImageClick,
  attachedImagePreview,
  onRemoveAttachedImage,
  isProcessingImage,
  processingImageText,
  inputPlaceholder,
  chatError,
  countryMappings,
  onCountryClick
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  React.useEffect(() => {
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col h-full bg-analyst-dark-bg text-analyst-text-primary">
      <main className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isLoading && welcomeMessage}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-analyst-accent text-white'
                  : 'bg-analyst-input text-analyst-text-primary'
              }`}
            >
              {msg.imagePreview && (
                <img src={msg.imagePreview} alt="User upload preview" className="rounded-lg max-w-xs mb-2 border border-analyst-border" />
              )}
               {msg.role === 'model' ? (
                  <ChatMessageRenderer 
                    text={msg.text} 
                    countryMappings={countryMappings} 
                    onCountryClick={onCountryClick}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'model' && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-analyst-input flex items-center gap-2">
              <Spinner />
              <span className="text-sm text-analyst-text-secondary">{thinkingText}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 flex-shrink-0">
         {isProcessingImage && (
             <div className="flex items-center gap-2 text-sm text-analyst-text-secondary mb-2 px-1">
                 <Spinner />
                 <span>{processingImageText}</span>
             </div>
         )}
         {chatError && (
              <div className="text-sm text-red-500 mb-2 px-1">
                {chatError}
              </div>
         )}
         {attachedImagePreview && (
            <div className="mb-2 ml-10 relative w-20 h-20">
                <img src={attachedImagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border border-analyst-border" />
                <button 
                    onClick={onRemoveAttachedImage}
                    className="absolute -top-1.5 -right-1.5 bg-analyst-sidebar text-white rounded-full p-0.5 hover:bg-analyst-item-hover shadow"
                    aria-label={processingImageText}
                >
                    <XCircleIcon className="w-5 h-5"/>
                </button>
            </div>
         )}
        <form onSubmit={onSendMessage} className="flex items-end gap-3 p-2 bg-analyst-input rounded-xl border border-analyst-border">
            <button type="button" onClick={onAttachImageClick} disabled={isLoading || isProcessingImage} className="p-2 flex-shrink-0 rounded-full hover:bg-analyst-item-hover text-analyst-text-secondary disabled:opacity-50 transition-colors" aria-label={processingImageText}>
                <PhotographIcon className="h-5 w-5" />
            </button>
             <textarea
                ref={textAreaRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage(e);
                    }
                }}
                placeholder={inputPlaceholder}
                className="w-full bg-transparent resize-none border-0 py-2.5 px-2 text-sm text-analyst-text-primary placeholder:text-analyst-text-secondary focus:ring-0 focus:outline-none max-h-36"
                rows={1}
                disabled={isLoading || isProcessingImage}
              />
          <button
            type="submit"
            disabled={isLoading || isProcessingImage || (!input.trim() && !attachedImagePreview)}
            className="w-8 h-8 rounded-full bg-analyst-text-secondary text-analyst-input disabled:opacity-50 enabled:hover:bg-analyst-accent enabled:hover:text-white transition-colors flex-shrink-0 flex items-center justify-center"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;
