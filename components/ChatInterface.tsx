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
    <div className="flex flex-col h-full bg-transparent">
      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && welcomeMessage}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
              }`}
            >
              {msg.imagePreview && (
                <img src={msg.imagePreview} alt="User upload preview" className="rounded-md max-w-xs mb-2 border border-blue-400/50" />
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
            <div className="max-w-[85%] rounded-lg px-4 py-2 bg-slate-100 dark:bg-slate-800 flex items-center gap-2">
              <Spinner />
              <span className="text-sm text-slate-500 dark:text-slate-400">{thinkingText}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 border-t border-slate-300/20 dark:border-slate-700/50 flex-shrink-0 bg-transparent">
         {isProcessingImage && (
             <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 px-1">
                 <Spinner />
                 <span>{processingImageText}</span>
             </div>
         )}
         {chatError && (
              <div className="text-sm text-red-600 dark:text-red-500 mb-2 px-1">
                {chatError}
              </div>
         )}
         {attachedImagePreview && (
            <div className="mb-2 relative w-24 h-24">
                <img src={attachedImagePreview} alt="Preview" className="w-full h-full object-cover rounded-md border border-slate-300 dark:border-slate-600" />
                <button 
                    onClick={onRemoveAttachedImage}
                    className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5 hover:bg-slate-800"
                    aria-label={processingImageText}
                >
                    <XCircleIcon className="w-5 h-5"/>
                </button>
            </div>
         )}
        <form onSubmit={onSendMessage} className="flex items-start gap-2">
           <div className="relative w-full flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg">
                <button type="button" onClick={onAttachImageClick} disabled={isLoading || isProcessingImage} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-50" aria-label={processingImageText}>
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
                className="w-full bg-transparent resize-none border-0 py-2.5 pr-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-0 focus:outline-none max-h-32"
                rows={1}
                disabled={isLoading || isProcessingImage}
              />
           </div>
          <button
            type="submit"
            disabled={isLoading || isProcessingImage || (!input.trim() && !attachedImagePreview)}
            className="p-2.5 rounded-full bg-blue-600 text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-blue-700 transition-colors self-end"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;