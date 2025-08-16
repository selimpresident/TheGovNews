import React, { useState, useEffect } from 'react';
import { Article, Source, AiAnalysisResult } from './types';
import { generateMockData } from './services/mockData';
import { Spinner } from './components/Spinner';
import LandingPage from './pages/LandingPage';
import CountryDetailPage from './pages/CountryDetailPage';
import AdminPanel from './pages/AdminPanel';
import { fetchAndBuildMappings, CountryMappings } from './services/countryDataService';
import ComparativeAnalysisPage from './pages/ComparativeAnalysisPage';
import AuthModal from './components/AuthModal';
import AIAnalystChatPopup from './components/AIAnalystChatPopup';
import { BeakerIcon } from './components/Icons';

interface View {
  name: 'landing' | 'country' | 'admin' | 'compare';
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


  useEffect(() => {
    const loadData = async () => {
        setInitialLoading(true);
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
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Spinner />
      </div>
    );
  }
  
  const mainContent = () => {
    switch (view.name) {
      case 'admin':
        return <AdminPanel setView={setView} countryMappings={countryMappings} />;
      case 'compare':
        return <ComparativeAnalysisPage setView={setView} countryMappings={countryMappings} />;
      case 'country':
        return (
          <CountryDetailPage
            countryName={view.context.countryName}
            allArticles={articles}
            allSources={sources}
            setView={setView}
            onToggleBookmark={handleToggleBookmark}
            onSetAiSummary={handleSetAiSummary}
            onSetAiAnalysis={handleSetAiAnalysis}
            countryMappings={countryMappings}
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage 
            setView={setView}
            countryMappings={countryMappings}
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-slate-100 dark:bg-slate-900">
      {mainContent()}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
       {isAnalystOpen && countryMappings && (
          <AIAnalystChatPopup
            isOpen={isAnalystOpen}
            onClose={() => setIsAnalystOpen(false)}
            countryMappings={countryMappings}
            setView={setView}
            allArticles={articles}
            allSources={sources}
            onToggleBookmark={handleToggleBookmark}
            onSetAiSummary={handleSetAiSummary}
            onSetAiAnalysis={handleSetAiAnalysis}
          />
        )}
      {!isAnalystOpen && (
          <button
              onClick={() => setIsAnalystOpen(true)}
              className="fixed bottom-6 left-6 z-30 flex items-center gap-3 pl-3 pr-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              aria-label="Open AI Analyst"
          >
              <BeakerIcon className="h-6 w-6" />
              <span className="font-semibold text-sm">AI Analyst</span>
          </button>
      )}
    </div>
  );
}

export default App;