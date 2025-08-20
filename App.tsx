import React, { useState, useEffect } from 'react';
import { Article, Source, AiAnalysisResult } from './types';
import { generateMockData } from './services/mockData';
import { Spinner } from './components/Spinner';
import LandingPage from './pages/LandingPage';
import CountryDetailPage from './pages/CountryDetailPage';
import NewCountryDetailPage from './pages/NewCountryDetailPage';
import AdminPanel from './pages/AdminPanel';
import { fetchAndBuildMappings, CountryMappings } from './services/countryDataService';
import ComparativeAnalysisPage from './pages/ComparativeAnalysisPage';
import AuthModal from './components/AuthModal';
import AIAnalystChatPopup from './components/AIAnalystChatPopup';
import { BeakerIcon } from './components/Icons';
import { initializeEnvironmentConfig } from './services/environmentConfig';
import { ErrorBoundary } from './components/ErrorBoundary';

interface View {
  name: 'landing' | 'country' | 'admin' | 'compare' | 'new-country';
  context?: any;
}

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [countryMappings, setCountryMappings] = useState<CountryMappings | null>(null);
  const [view, setView] = useState<View>({ name: 'landing' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAnalystOpen, setIsAnalystOpen] = useState(false);
  
  // Create a wrapper function for setView to match the expected type in child components
  const handleSetView = (newView: { name: string; context?: any }) => {
    setView(newView as View);
  };


  useEffect(() => {
    const loadData = async () => {
        setInitialLoading(true);
        
        // Initialize environment configuration first
        try {
          initializeEnvironmentConfig();
        } catch (error) {
          console.error('Failed to initialize environment configuration:', error);
          // In development, continue with fallback config
          if (!(import.meta as any).env?.DEV) {
            throw error;
          }
        }
        
        const mappings = await fetchAndBuildMappings();
        setCountryMappings(mappings);
        
        const { articles: fetchedArticles, sources: fetchedSources } = generateMockData();
        setArticles(fetchedArticles);
        setSources(fetchedSources);
        
        setInitialLoading(false);
    };
    loadData();
  }, []);

  const handleToggleBookmark = (articleId: string) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.article_id === articleId
          ? { ...article, bookmarked: !article.bookmarked }
          : article
      )
    );
  };

  const handleSetAiSummary = (articleId: string, summary: string) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.article_id === articleId
          ? { ...article, summary_ai: summary }
          : article
      )
    );
  };

  const handleSetAiAnalysis = (articleId: string, analysis: AiAnalysisResult) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.article_id === articleId
          ? { ...article, ai_analysis: analysis }
          : article
      )
    );
  };
  
  if (initialLoading || !countryMappings) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Spinner />
      </div>
    );
  }
  
  const mainContent = () => {
    switch (view.name) {
      case 'admin':
        return <AdminPanel setView={handleSetView} countryMappings={countryMappings} />;
      case 'compare':
        return <ComparativeAnalysisPage setView={handleSetView} countryMappings={countryMappings} />;
      case 'country':
        return (
          <CountryDetailPage
            countryName={view.context.countryName}
            allArticles={articles}
            allSources={sources}
            setView={handleSetView}
            onToggleBookmark={handleToggleBookmark}
            onSetAiSummary={handleSetAiSummary}
            onSetAiAnalysis={handleSetAiAnalysis}
            countryMappings={countryMappings}
          />
        );
      case 'new-country':
        return <NewCountryDetailPage countryCode={countryMappings.turkishToCca3.get(view.context?.countryName) || ''} countryName={view.context?.countryName} setView={handleSetView} />;
      case 'landing':
      default:
        return (
          <LandingPage 
            setView={handleSetView}
            countryMappings={countryMappings}
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
        );
    }
  };

  return (
    <ErrorBoundary level="page">
      <div className="h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <ErrorBoundary level="feature">
          {mainContent()}
        </ErrorBoundary>
        
        <ErrorBoundary level="component">
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </ErrorBoundary>
        
        {isAnalystOpen && countryMappings && (
          <ErrorBoundary level="feature">
            <AIAnalystChatPopup
              isOpen={isAnalystOpen}
              onClose={() => setIsAnalystOpen(false)}
              countryMappings={countryMappings}
              setView={handleSetView}
              allArticles={articles}
              allSources={sources}
              onToggleBookmark={handleToggleBookmark}
              onSetAiSummary={handleSetAiSummary}
              onSetAiAnalysis={handleSetAiAnalysis}
            />
          </ErrorBoundary>
        )}
        
        {!isAnalystOpen && (
          <ErrorBoundary level="component">
            <button
                onClick={() => setIsAnalystOpen(true)}
                className="fixed bottom-3 left-3 z-30 flex items-center gap-2 pl-2 pr-3 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Open AI Analyst"
            >
                <BeakerIcon className="h-4 w-4" />
                <span className="font-semibold text-xs hidden sm:inline">AI Analyst</span>
            </button>
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;