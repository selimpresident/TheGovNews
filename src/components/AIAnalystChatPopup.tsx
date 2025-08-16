import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChatMessage, Article, Source, AiAnalysisResult } from '../types';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Chat, Part } from '@google/genai';
import { CloseIcon, PlusIcon, GlobeAltIcon, ArrowsRightLeftIcon } from './Icons';
import ChatInterface from './ChatInterface';
import { processImageFile } from '../utils/imageUtils';
import { CountryMappings } from '../services/countryDataService';
import CountryDetailPage from '../pages/CountryDetailPage';

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

interface AIAnalystChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  countryMappings: CountryMappings;
  setView: (view: { name: string; context?: any }) => void;
  allArticles: Article[];
  allSources: Source[];
  onToggleBookmark: (articleId: string) => void;
  onSetAiSummary: (articleId: string, summary: string) => void;
  onSetAiAnalysis: (articleId: string, analysis: AiAnalysisResult) => void;
}

const AIAnalystChatPopup: React.FC<AIAnalystChatPopupProps> = ({ 
    isOpen, onClose, countryMappings, setView,
    allArticles, allSources, onToggleBookmark, onSetAiSummary, onSetAiAnalysis
}) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [splitViewCountry, setSplitViewCountry] = useState<string | null>(null);
    
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('ai-analyst-history');
            if (savedHistory) {
                const parsedHistory: Conversation[] = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                    setConversations(parsedHistory);
                    if (!activeConversationId) {
                      setActiveConversationId(parsedHistory[0].id);
                    }
                } else {
                  handleNewChat();
                }
            } else {
                handleNewChat();
            }
        } catch (error) {
            console.error("Failed to load chat history from localStorage", error);
            handleNewChat();
        }
    }, []);

    useEffect(() => {
        try {
            if (conversations.length > 0) {
                localStorage.setItem('ai-analyst-history', JSON.stringify(conversations));
            }
        } catch (error) {
            console.error("Failed to save chat history to localStorage", error);
        }
    }, [conversations]);


    const activeMessages = useMemo(() => {
        if (!activeConversationId) return [];
        return conversations.find(c => c.id === activeConversationId)?.messages || [];
    }, [activeConversationId, conversations]);

    useEffect(() => {
        if (isOpen) {
            const systemInstruction = `You are a world-class geopolitical analyst named 'TheGovNews Analyst'. Your knowledge is up-to-date. Provide detailed, neutral, and factual analysis. When asked, cite potential sources if possible but do not invent URLs. Keep answers concise but informative. You can also analyze images provided by the user. If you mention a country name that is supported by the app, just say the name of the country. Supported countries: ${Array.from(countryMappings.turkishToEnglish.values()).join(', ')}.`;
            const session = createChatSession(systemInstruction);
            setChatSession(session);

            if (conversations.length === 0) {
              handleNewChat();
            } else if (!activeConversationId) {
              setActiveConversationId(conversations[0]?.id || null);
            }
        } else {
            setSplitViewCountry(null);
        }
    }, [isOpen, countryMappings.turkishToEnglish]);

    const handleNewChat = () => {
        const newId = `chat-${Date.now()}`;
        const newConversation: Conversation = {
            id: newId,
            title: "New Chat",
            messages: []
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newId);
        setInput('');
        setAttachedImage(null);
        setImagePreview(null);
        setChatError(null);
        setSplitViewCountry(null);
    };

    const handleAttachImage = () => {
        imageInputRef.current?.click();
    };

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessingImage(true);
            setChatError(null);
            try {
                const { previewUrl } = await processImageFile(file);
                setAttachedImage(file);
                setImagePreview(previewUrl);
            } catch (err) {
                setChatError((err as Error).message);
            } finally {
                setIsProcessingImage(false);
            }
        }
        if (e.target) e.target.value = '';
    };

    const handleRemoveImage = () => {
        setAttachedImage(null);
        setImagePreview(null);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentConvId = activeConversationId;
        if ((!input.trim() && !attachedImage) || !chatSession || isLoading || !currentConvId) return;

        const userMessageText = input;
        const userMessageForHistory: ChatMessage = { role: 'user', text: userMessageText, imagePreview };
        
        const currentMessages = conversations.find(c => c.id === currentConvId)?.messages || [];
        
        setConversations(prev => prev.map(c => 
            c.id === currentConvId ? { 
                ...c, 
                title: currentMessages.length === 0 ? (userMessageText.substring(0, 40) || "Image Analysis") : c.title,
                messages: [...c.messages, userMessageForHistory] 
            } : c
        ));

        setInput('');
        const imageToProcess = attachedImage;
        setAttachedImage(null);
        setImagePreview(null);
        setIsLoading(true);
        setChatError(null);

        try {
            let messageForApi: string | Part[];
            if (imageToProcess) {
                const { base64Data, mimeType } = await processImageFile(imageToProcess);
                messageForApi = [
                    { text: userMessageText },
                    { inlineData: { mimeType, data: base64Data } }
                ];
            } else {
                messageForApi = userMessageText;
            }

            const stream = sendMessageStream({ message: messageForApi, chat: chatSession });
            let modelResponse = '';
            setConversations(prev => prev.map(c => c.id === currentConvId ? { ...c, messages: [...c.messages, { role: 'model', text: '' }] } : c));

            for await (const chunk of stream) {
                modelResponse += chunk;
                setConversations(prev => prev.map(c => {
                    if (c.id === currentConvId) {
                        const newMessages = [...c.messages];
                        newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                        return { ...c, messages: newMessages };
                    }
                    return c;
                }));
            }
        } catch (error) {
            console.error(error);
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            setChatError(errorMessage);
            setConversations(prev => prev.map(c => c.id === currentConvId ? {...c, messages: c.messages.filter(msg => msg.role !== 'model' || msg.text !== '')} : c));
        } finally {
            setIsLoading(false);
        }
    };
    
    const welcomeMessage = (
      <div className="p-4 rounded-lg text-sm bg-analyst-input text-analyst-text-primary">
          Welcome to the Global Analyst chat. Ask me anything about current geopolitical events, trends, or analysis.
      </div>
    );

    const handleCountryClick = (countryName: string) => {
        setView({ name: 'country', context: { countryName } });
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
            <input type="file" accept="image/png, image/jpeg, image/webp" ref={imageInputRef} onChange={handleImageFileChange} className="hidden" />
            
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] my-auto bg-analyst-dark-bg rounded-xl shadow-2xl flex flex-row overflow-hidden border border-analyst-border" onClick={(e) => e.stopPropagation()}>
                {/* History Panel */}
                 <div className="w-[280px] flex-shrink-0 h-full flex flex-col bg-analyst-sidebar border-r border-analyst-border">
                    <div className="p-4 border-b border-analyst-border flex-shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <GlobeAltIcon className="h-6 w-6 text-analyst-accent" />
                            <h2 id="ai-analyst-popup-title" className="text-lg font-bold text-analyst-text-primary">AI Analyst</h2>
                        </div>
                        <button onClick={handleNewChat} className="p-1.5 rounded-md bg-analyst-accent text-white hover:opacity-90 transition-opacity" title="New Chat">
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => {
                                onClose();
                                setView({ name: 'compare' });
                            }}
                            className="w-full group flex items-center gap-3 text-left px-3 py-2 rounded-md text-sm truncate transition-colors text-analyst-text-secondary hover:bg-analyst-item-hover hover:text-analyst-text-primary"
                        >
                            <ArrowsRightLeftIcon className="h-5 w-5 text-analyst-text-secondary group-hover:text-analyst-text-primary transition-colors" />
                            <span>Compare Countries</span>
                        </button>
                    </div>

                    <div className="px-2">
                        <div className="border-t border-analyst-border"></div>
                    </div>

                    <nav className="flex-grow overflow-y-auto p-2 space-y-1">
                        {conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversationId(conv.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${activeConversationId === conv.id ? 'bg-analyst-item-active text-analyst-text-primary' : 'text-analyst-text-secondary hover:bg-analyst-item-hover hover:text-analyst-text-primary'}`}
                            >
                                {conv.title || "New Chat"}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow h-full flex flex-col overflow-hidden">
                    <ChatInterface
                        messages={activeMessages}
                        input={input}
                        onInputChange={(e) => setInput(e.target.value)}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        thinkingText="Analyst is thinking..."
                        welcomeMessage={welcomeMessage}
                        onAttachImageClick={handleAttachImage}
                        attachedImagePreview={imagePreview}
                        onRemoveAttachedImage={handleRemoveImage}
                        isProcessingImage={isProcessingImage}
                        processingImageText="Processing image..."
                        inputPlaceholder="Ask the global analyst..."
                        chatError={chatError}
                        countryMappings={countryMappings}
                        onCountryClick={handleCountryClick}
                    />
                </div>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
                <CloseIcon className="w-6 h-6 text-white" />
            </button>
        </div>
    );
};

export default AIAnalystChatPopup;
