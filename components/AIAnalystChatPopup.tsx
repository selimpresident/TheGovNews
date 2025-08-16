import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChatMessage, Article, Source, AiAnalysisResult } from '../types';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Chat, Part } from '@google/genai';
import { CloseIcon, PlusIcon, ChatBubbleLeftRightIcon, BeakerIcon } from './Icons';
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
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                    setConversations(parsedHistory);
                    setActiveConversationId(parsedHistory[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to load chat history from localStorage", error);
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
    
    const welcomeMessage = useMemo(() => (
        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            Welcome to the Global Analyst chat. Ask me anything about current geopolitical events, trends, or analysis.
        </div>
    ), []);

    const handleCountryClick = (countryName: string) => {
        setSplitViewCountry(countryName);
    };

    return (
        <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md dark:bg-slate-900/80" onClick={onClose} aria-hidden="true"></div>
            <input type="file" accept="image/png, image/jpeg, image/webp" ref={imageInputRef} onChange={handleImageFileChange} className="hidden" />
            
            <div className="relative w-full h-full p-4 sm:p-8 md:p-12 lg:p-16 flex flex-row gap-4" onClick={(e) => e.stopPropagation()}>
                {/* History Panel */}
                 <div className={`
                    flex-shrink-0 h-full flex flex-col bg-black/20 rounded-xl
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${splitViewCountry ? 'w-0 max-w-0 p-0 border-0 opacity-0' : 'w-full max-w-xs border border-slate-700/50'}
                `}>
                    <div className={`h-full flex flex-col transition-opacity duration-200 ${splitViewCountry ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="p-4 border-b border-slate-700 flex-shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BeakerIcon className="h-6 w-6 text-blue-400" />
                                <h2 id="ai-analyst-popup-title" className="text-lg font-bold text-slate-100">AI Analyst</h2>
                            </div>
                            <button onClick={handleNewChat} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-600/50 text-white text-sm font-semibold hover:bg-blue-600/80 transition-colors" title="New Chat">
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <nav className="flex-grow overflow-y-auto p-2 space-y-1">
                            {conversations.map(conv => (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveConversationId(conv.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${activeConversationId === conv.id ? 'bg-slate-700 text-slate-100' : 'text-slate-300 hover:bg-slate-700/50'}`}
                                >
                                    {conv.title || "New Chat"}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-grow h-full grid gap-4 transition-all duration-300 ${splitViewCountry ? 'grid-cols-3' : 'grid-cols-1'}`}>
                    <div className="h-full bg-black/20 border border-slate-700/50 rounded-xl flex flex-col overflow-hidden">
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
                    {splitViewCountry && (
                        <div className="col-span-2 h-full bg-black/20 border border-slate-700/50 rounded-xl flex flex-col relative overflow-hidden">
                            <button onClick={() => setSplitViewCountry(null)} className="absolute top-2 right-2 z-50 p-1.5 bg-slate-900/50 rounded-full hover:bg-slate-800/80">
                                <CloseIcon className="w-5 h-5 text-white" />
                            </button>
                            <div className="overflow-y-auto w-full h-full">
                                <CountryDetailPage
                                    isEmbedded={true}
                                    countryName={splitViewCountry}
                                    allArticles={allArticles}
                                    allSources={allSources}
                                    setView={setView}
                                    onToggleBookmark={onToggleBookmark}
                                    onSetAiSummary={onSetAiSummary}
                                    onSetAiAnalysis={onSetAiAnalysis}
                                    countryMappings={countryMappings}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                <CloseIcon className="w-6 h-6 text-white" />
            </button>
        </div>
    );
};

export default AIAnalystChatPopup;