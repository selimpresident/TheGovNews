/**
 * Refactored CountryDetailPage with improved state management
 * Uses useReducer instead of multiple useState hooks for better performance and maintainability
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Article, Source, Topic, AiAnalysisResult } from '../types';
import MinistrySidebar from '../components/MinistrySidebar';
import ArticleList from '../components/ArticleList';
import ArticleModal from '../components/ArticleModal';
import Header from '../components/Header';
import { ministriesData } from '../data/ministries';
import { fetchConflictEvents } from '../services/ucdp';
import { fetchGdeltArticles } from '../services/gdeltService';
import { fetchNationalPress } from '../services/geminiService';
import { fetchCountryProfileFactbook, slugify } from '../services/ciaFactbookService';
import { fetchWorldBankData } from '../services/worldBankService';
import { fetchOecdData } from '../services/oecdService';
import { fetchNoaaData } from '../services/noaaService';
import { fetchReliefWebUpdates } from '../services/reliefWebService';
import { fetchPopulationPyramidData } from '../services/populationPyramidService';
import { fetchCountryRoads } from '../services/openstreetmapService';
import { fetchAllSocialMedia } from '../services/socialMediaService';
import { socialMediaData } from '../data/socialMediaData';
import { Spinner } from '../components/Spinner';
import { CountryMappings } from '../services/countryDataService';
import OecdPanel from '../components/OecdPanel';
import NoaaPanel from '../components/NoaaPanel';
import ReliefWebPanel from '../components/ReliefWebPanel';
import PopulationPyramidPanel from '../components/PopulationPyramidPanel';
import OsmRoadsPanel from '../components/OsmRoadsPanel';
import SocialMediaPanel from '../components/SocialMediaPanel';
import AnimatedFlagBackground from '../components/AnimatedFlagBackground';
import CountryWelcomeDisplay from '../components/CountryWelcomeDisplay';
import MiniDashboard from '../components/MiniDashboard';
import Timeline from '../components/Timeline';
import ConflictInfoPanel from '../components/panels/ConflictInfoPanel';
import GdeltInfoPanel from '../components/panels/GdeltInfoPanel';
import NationalPressPanel from '../components/panels/NationalPressPanel';
import FactbookPanel from '../components/panels/FactbookPanel';
import WorldBankPanel from '../components/panels/WorldBankPanel';
import { useDataSourceReducer, DataSourceKey } from '../hooks/useDataSourceReducer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useErrorHandler } from '../components/ErrorBoundary';


type ActiveSelection = 'all' | 'bookmarks' | 'conflicts' | 'gdelt' | 'nationalPress' | 'factbook' | 'worldBank' | 'oecd' | 'noaa' | 'reliefWeb' | 'populationPyramid' | 'osm' | 'socialMedia' | string | null;
type Category = 'official' | 'intelligence' | 'data';

interface CountryDetailPageProps {
  countryName: string;
  allArticles: Article[];
  allSources: Source[];
  setView: (view: { name: string; context?: any }) => void;
  onToggleBookmark: (articleId: string) => void;
  onSetAiSummary: (articleId: string, summary: string) => void;
  onSetAiAnalysis: (articleId: string, analysis: AiAnalysisResult) => void;
  countryMappings: CountryMappings;
  isEmbedded?: boolean;
}

const ministryToTopicMap: Partial<Record<string, Topic>> = {
    'ministry.defense': 'defense',
    'ministry.nationalDefense': 'defense',
    'ministry.armedForces': 'defense',
    'ministry.defence': 'defense',
    'ministry.peoplesArmedForces': 'defense',
    'ministry.health': 'health',
    'ministry.publicHealth': 'health',
    'ministry.healthAndHumanServices': 'health',
    'ministry.trade': 'economy',
    'ministry.economy': 'economy',
    'ministry.finance': 'economy',
    'ministry.treasuryAndFinance': 'economy',
    'ministry.commerce': 'economy',
    'ministry.industryAndTechnology': 'technology',
    'ministry.scienceTechnologyAndInnovation': 'technology',
    'ministry.digitalDevelopmentAndTransport': 'technology',
    'ministry.scienceAndICT': 'technology',
    'ministry.foreignAffairs': 'diplomacy',
    'ministry.externalRelations': 'diplomacy',
    'ministry.interior': 'internal-security',
    'ministry.homeAffairs': 'internal-security',
    'ministry.publicSecurity': 'internal-security',
    'ministry.justice': 'internal-security',
    'ministry.environment': 'environment',
    'ministry.climateChangeAndEnvironment': 'environment',
    'ministry.agricultureAndForestry': 'environment',
    'ministry.agriculture': 'environment'
};

const CountryDetailPageRefactored: React.FC<CountryDetailPageProps> = ({ 
    countryName, allArticles, allSources, setView, onToggleBookmark, 
    onSetAiSummary, onSetAiAnalysis, countryMappings, isEmbedded = false 
}) => {
  // Unified state management with useReducer
  const { state, actions, getters } = useDataSourceReducer();
  
  // Local UI state (kept minimal)
  const [activeSelection, setActiveSelection] = useState<ActiveSelection>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('official');
  const [modalArticle, setModalArticle] = useState<Article | null>(null);
  
  // Error handling
  const handleError = useErrorHandler();
  
  // Memoized values
  const englishCountryName = useMemo(() => 
    countryMappings.turkishToEnglish.get(countryName) || countryName, 
    [countryName, countryMappings]
  );

  const countryGeography = useMemo(() => {
    const worldAtlas = state.worldAtlas.data;
    if (!worldAtlas) return null;

    return worldAtlas.objects.countries.geometries.find((g: any) => {
        const geoName = (g.properties.name || g.properties.NAME || g.properties.NAME_LONG);
        if (!geoName) return false;
        
        const normalizedGeoName = geoName.trim().toLowerCase();
        return countryMappings.geoJsonNameToTurkish.get(normalizedGeoName) === countryName;
    });
  }, [state.worldAtlas.data, countryName, countryMappings]);

  const countryData = useMemo(() => {
    const countryCode = countryMappings.turkishToCca2.get(countryName)?.toLowerCase();
    
    const sourcesForCountry = allSources.filter(s => {
        const sourceCountryCode = s.id.split('_')[0];
        return sourceCountryCode === countryCode;
    });

    const sourceIds = new Set(sourcesForCountry.map(s => s.id));
    const articlesForCountry = allArticles
        .filter(a => sourceIds.has(a.source_id))
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    const bookmarkedArticles = articlesForCountry.filter(a => a.bookmarked);
    const ministriesForCountry = ministriesData[countryName] || [];
    
    return { sourcesForCountry, articlesForCountry, bookmarkedArticles, ministriesForCountry };
  }, [countryName, allArticles, allSources, countryMappings]);

  const filteredArticles = useMemo(() => {
    if (activeSelection === 'bookmarks') {
        return countryData.bookmarkedArticles;
    }
    if (activeSelection === 'all') {
      return countryData.articlesForCountry;
    }

    const topicToFilter = ministryToTopicMap[activeSelection as string];
    if (topicToFilter) {
        return countryData.articlesForCountry.filter(article => 
            article.topics.includes(topicToFilter)
        );
    }
    
    if (activeSelection && !Object.keys(ministryToTopicMap).includes(activeSelection)) {
        return countryData.articlesForCountry.filter(a => a.source_name === activeSelection);
    }

    return [];
  }, [activeSelection, countryData]);

  // Data fetching functions with error handling
  const fetchDataSource = useCallback(async <T>(
    source: DataSourceKey,
    fetchFn: () => Promise<T>
  ): Promise<void> => {
    try {
      actions.fetchStart(source);
      const data = await fetchFn();
      actions.fetchSuccess(source, data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      actions.fetchError(source, errorMessage);
      handleError(error as Error, { source, countryName });
    }
  }, [actions, handleError, countryName]);

  // Load world atlas on mount
  useEffect(() => {
    const loadWorldAtlas = async () => {
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const data = await response.json();
        actions.worldAtlasSuccess(data);
      } catch (error) {
        console.error("Failed to load world atlas:", error);
        handleError(error as Error, { source: 'worldAtlas' });
      }
    };
    
    if (!state.worldAtlas.data) {
      loadWorldAtlas();
    }
  }, []);

  // Reset state when country changes
  useEffect(() => {
    setActiveSelection(null);
    setActiveCategory('official');
    setModalArticle(null);
    actions.resetAll();
  }, [countryName]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
        try {
          const cca3 = countryMappings.turkishToCca3.get(countryName);
          const ucdpName = countryMappings.turkishToUcdpName.get(countryName);
          
          let population: number | null = null;
          let gdp: number | null = null;
          let latestEventDate: string | null = null;

          if (cca3) {
              const wbData = await fetchWorldBankData(cca3);
              population = wbData.find(d => d.indicatorCode === 'SP.POP.TOTL')?.value ?? null;
              gdp = wbData.find(d => d.indicatorCode === 'NY.GDP.MKTP.CD')?.value ?? null;
          }
          
          if (ucdpName) {
              try {
                  const conflicts = await fetchConflictEvents(ucdpName);
                  if (conflicts.length > 0) {
                      latestEventDate = conflicts[0].date;
                  }
              } catch (e) {
                  console.error("Could not fetch latest event date for dashboard", e);
              }
          }
          
          actions.updateDashboard({ population, gdp, latestEventDate });
        } catch (error) {
          handleError(error as Error, { source: 'dashboard', countryName });
        }
    };
    
    loadDashboardData();
  }, [countryName, countryMappings]);

  // Data loading effect based on active selection
  useEffect(() => {
    const loadDataForSelection = async () => {
      switch (activeSelection) {
        case 'conflicts':
          if (!getters.hasData('conflicts') || getters.isDataStale('conflicts')) {
            const ucdpName = countryMappings.turkishToUcdpName.get(countryName);
            if (ucdpName) {
              await fetchDataSource('conflicts', () => fetchConflictEvents(ucdpName));
            } else {
              actions.fetchError('conflicts', `No UCDP name mapping found for ${countryName}`);
            }
          }
          break;

        case 'gdelt':
          if (!getters.hasData('gdelt') || getters.isDataStale('gdelt')) {
            await fetchDataSource('gdelt', () => fetchGdeltArticles(englishCountryName));
          }
          break;

        case 'nationalPress':
          if (!getters.hasData('nationalPress') || getters.isDataStale('nationalPress')) {
            await fetchDataSource('nationalPress', () => fetchNationalPress(countryName, countryMappings));
          }
          break;

        case 'factbook':
          if (!getters.hasData('factbook') || getters.isDataStale('factbook')) {
            let slug = slugify(englishCountryName);
            if (englishCountryName === 'United States of America') {
              slug = 'united-states';
            }
            await fetchDataSource('factbook', () => fetchCountryProfileFactbook(slug));
          }
          break;

        case 'worldBank':
          if (!getters.hasData('worldBank') || getters.isDataStale('worldBank')) {
            const cca3 = countryMappings.turkishToCca3.get(countryName);
            if (cca3) {
              await fetchDataSource('worldBank', () => fetchWorldBankData(cca3));
            } else {
              actions.fetchError('worldBank', `No CCA3 code found for ${countryName}`);
            }
          }
          break;

        case 'oecd':
          if (!getters.hasData('oecd') || getters.isDataStale('oecd')) {
            const cca3 = countryMappings.turkishToCca3.get(countryName);
            if (cca3) {
              await fetchDataSource('oecd', () => fetchOecdData(cca3));
            } else {
              actions.fetchError('oecd', `No CCA3 code found for ${countryName} for OECD`);
            }
          }
          break;

        case 'noaa':
          if (!getters.hasData('noaa') || getters.isDataStale('noaa')) {
            const cca2 = countryMappings.turkishToCca2.get(countryName);
            if (cca2) {
              await fetchDataSource('noaa', () => fetchNoaaData(cca2));
            } else {
              actions.fetchError('noaa', `No CCA2/FIPS code found for ${countryName}`);
            }
          }
          break;

        case 'reliefWeb':
          if (!getters.hasData('reliefWeb') || getters.isDataStale('reliefWeb')) {
            const cca3 = countryMappings.turkishToCca3.get(countryName);
            if (cca3) {
              await fetchDataSource('reliefWeb', () => fetchReliefWebUpdates(cca3, englishCountryName));
            } else {
              actions.fetchError('reliefWeb', `No CCA3 code found for ${countryName}`);
            }
          }
          break;

        case 'populationPyramid':
          if (!getters.hasData('populationPyramid') || getters.isDataStale('populationPyramid')) {
            await fetchDataSource('populationPyramid', () => fetchPopulationPyramidData(englishCountryName));
          }
          break;

        case 'osm':
          if (!getters.hasData('osm') || getters.isDataStale('osm')) {
            await fetchDataSource('osm', () => fetchCountryRoads(englishCountryName));
          }
          break;

        case 'socialMedia':
          if (state.socialMedia.status === 'idle') {
            const links = socialMediaData[countryName] || null;
            actions.socialMediaStart(links);
            
            if (!links || (!links.x && !links.youtube)) {
              actions.socialMediaError(links);
              return;
            }
            
            try {
              const posts = await fetchAllSocialMedia(links);
              posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
              actions.socialMediaSuccess(posts, links);
            } catch (error) {
              actions.socialMediaError(links);
              handleError(error as Error, { source: 'socialMedia', countryName });
            }
          }
          break;
      }
    };

    if (activeSelection && activeSelection !== 'all' && activeSelection !== 'bookmarks') {
      loadDataForSelection();
    }
  }, [activeSelection, countryName, countryMappings, englishCountryName]);

  // Event handlers with useCallback for performance
  const handleSetCategory = useCallback((category: Category) => {
    setActiveCategory(category);
    if (category === 'official') {
      setActiveSelection('all');
    } else if (category === 'intelligence') {
      setActiveSelection('socialMedia');
    } else if (category === 'data') {
      setActiveSelection('factbook');
    }
  }, []);

  const handleSelect = useCallback((selection: ActiveSelection) => {
    setActiveSelection(selection);
  }, []);
  
  const handleSelectArticle = useCallback((article: Article) => {
    const fullArticleData = allArticles.find(a => a.article_id === article.article_id) || article;
    setModalArticle(fullArticleData);
  }, [allArticles]);

  const handleToggleArticleBookmark = useCallback((articleId: string) => {
    onToggleBookmark(articleId);
    if (modalArticle?.article_id === articleId) {
        setModalArticle(prev => prev ? { ...prev, bookmarked: !prev.bookmarked } : null);
    }
  }, [onToggleBookmark, modalArticle?.article_id]);
  
  const handleSetAiSummaryForModal = useCallback((summary: string) => {
    if (modalArticle) {
        onSetAiSummary(modalArticle.article_id, summary);
        setModalArticle(prev => prev ? { ...prev, summary_ai: summary } : null);
    }
  }, [modalArticle, onSetAiSummary]);

  const handleSetAiAnalysisForModal = useCallback((analysis: AiAnalysisResult) => {
    if (modalArticle) {
        onSetAiAnalysis(modalArticle.article_id, analysis);
        setModalArticle(prev => prev ? { ...prev, ai_analysis: analysis } : null);
    }
  }, [modalArticle, onSetAiAnalysis]);

  // Render main content based on active selection
  const renderMainContent = () => {
      if (activeSelection === null) {
        return (
            <CountryWelcomeDisplay
                countryName={englishCountryName}
                geography={countryGeography}
                worldAtlas={state.worldAtlas.data}
                coordinates={countryMappings.turkishToLatLng.get(countryName)}
                countryMappings={countryMappings}
            />
        );
      }

      // Handle data source panels with consistent loading/error states
      const renderDataPanel = (source: DataSourceKey, PanelComponent: React.ComponentType<any>, props: any = {}) => {
        if (getters.isLoading(source)) {
          return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
        }
        
        const data = getters.getData(source);
        const error = getters.getError(source);
        
        if (error) {
          return (
            <div className="flex flex-col justify-center items-center h-full min-h-[40vh] text-center p-8">
              <p className="text-red-600 dark:text-red-400 mb-2">Veri yüklenirken hata oluştu</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
              <button 
                onClick={() => actions.resetSource(source)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          );
        }
        
        if (data) {
          return <PanelComponent data={data} countryName={englishCountryName} {...props} />;
        }
        
        return null;
      };

      switch (activeSelection) {
        case 'conflicts':
          return renderDataPanel('conflicts', ConflictInfoPanel, { events: getters.getData('conflicts') });
          
        case 'gdelt':
          return (
            <div className="h-full flex flex-col">
                <div className="p-6 md:p-8 border-b border-slate-200/70 dark:border-slate-700/50 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Global Media Watch</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{`Recent articles from global media sources mentioning ${englishCountryName}`}</p>
                </div>
                {getters.isLoading('gdelt') ? (
                    <div className="flex-grow flex justify-center items-center"><Spinner /></div>
                ) : (
                    <GdeltInfoPanel articles={getters.getData('gdelt') || []} countryName={englishCountryName} error={getters.getError('gdelt')} />
                )}
            </div>
          );
          
        case 'nationalPress':
          return renderDataPanel('nationalPress', NationalPressPanel, { articles: getters.getData('nationalPress') });
          
        case 'factbook':
          return renderDataPanel('factbook', FactbookPanel);
          
        case 'worldBank':
          return renderDataPanel('worldBank', WorldBankPanel);
          
        case 'oecd':
          return renderDataPanel('oecd', OecdPanel);
          
        case 'noaa':
          return renderDataPanel('noaa', NoaaPanel);
          
        case 'reliefWeb':
          return renderDataPanel('reliefWeb', ReliefWebPanel, { updates: getters.getData('reliefWeb') });
          
        case 'populationPyramid':
          return renderDataPanel('populationPyramid', PopulationPyramidPanel);
          
        case 'osm':
          const latLng = countryMappings.turkishToLatLng.get(countryName);
          if (!latLng) {
              return (
                 <div className="text-center p-16">
                    <p className="text-slate-500 dark:text-slate-400">{`Map coordinates not available for ${englishCountryName}.`}</p>
                 </div>
              );
          }
          return <OsmRoadsPanel 
            data={getters.getData('osm')} 
            countryName={englishCountryName} 
            center={latLng} 
            isLoading={getters.isLoading('osm')} 
          />;
          
        case 'socialMedia':
          if (state.socialMedia.status === 'loading') {
              return <div className="flex flex-col justify-center items-center h-full min-h-[60vh]">
                          <Spinner />
                          <p className="mt-4 text-slate-500 dark:text-slate-400">Fetching social media posts...</p>
                     </div>;
          }
          return <SocialMediaPanel 
                      status={state.socialMedia.status} 
                      posts={state.socialMedia.posts} 
                      links={state.socialMedia.links}
                      countryName={englishCountryName} 
                  />
                  
        default:
          return <ArticleList articles={filteredArticles} onArticleSelect={handleSelectArticle} onToggleBookmark={onToggleBookmark} />;
      }
  };

  const flagUrl = countryMappings.turkishToFlagUrl.get(countryName);
  const coordinates = countryMappings.turkishToLatLng.get(countryName);

  return (
    <ErrorBoundary level="page">
      <div className={`relative ${isEmbedded ? 'h-full' : 'h-screen overflow-hidden'}`}>
         <style>{`
          @keyframes kenburns {
            0% {
              transform: scale(1.1) translate(2%, -2%);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.25) translate(-2%, 2%);
              opacity: 1;
            }
            100% {
              transform: scale(1.1) translate(2%, -2%);
              opacity: 0.7;
            }
          }
          .animate-kenburns {
            animation: kenburns 45s ease-in-out infinite;
          }

          @keyframes contentFadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-content-fade-in {
            animation: contentFadeIn 0.4s ease-out forwards;
          }
        `}</style>
        
        {!isEmbedded && (
          <ErrorBoundary level="component">
            <AnimatedFlagBackground 
                flagUrl={flagUrl} 
                countryName={englishCountryName} 
                geography={countryGeography}
                worldAtlas={state.worldAtlas.data}
                coordinates={coordinates}
            />
          </ErrorBoundary>
        )}
        
        {!isEmbedded && (
          <ErrorBoundary level="component">
            <Header onNavigateBack={() => setView({ name: 'landing' })} activeCategory={activeCategory} onSetCategory={handleSetCategory} />
          </ErrorBoundary>
        )}
        
        <div className={`flex flex-col h-full ${isEmbedded ? '' : 'max-h-screen'}`}>
          {!isEmbedded && (
              <ErrorBoundary level="component">
                <div className="flex-shrink-0 px-2 sm:px-3 py-2">
                    <MiniDashboard 
                        population={state.dashboard.population}
                        gdp={state.dashboard.gdp}
                        latestEventDate={state.dashboard.latestEventDate}
                    />
                </div>
              </ErrorBoundary>
          )}
          
          <div className="flex-1 flex gap-2 sm:gap-3 px-2 sm:px-3 pb-2 overflow-hidden">
              <ErrorBoundary level="component">
                <div className="w-64 sm:w-72 lg:w-80 flex-shrink-0">
                    <MinistrySidebar
                        countryName={countryName}
                        englishCountryName={englishCountryName}
                        countryMappings={countryMappings}
                        ministries={countryData.ministriesForCountry}
                        activeCategory={activeCategory}
                        activeSelection={activeSelection}
                        onSelect={handleSelect}
                        bookmarkCount={countryData.bookmarkedArticles.length}
                        setView={setView}
                    />
                </div>
              </ErrorBoundary>
              
              <ErrorBoundary level="feature">
                <main className="flex-1 bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg shadow-lg overflow-hidden flex flex-col">
                    {!isEmbedded && activeCategory === 'official' && (
                        <ErrorBoundary level="component">
                          <div className="flex-shrink-0">
                              <Timeline articles={countryData.articlesForCountry} onArticleSelect={handleSelectArticle} />
                          </div>
                        </ErrorBoundary>
                    )}
                    <div key={activeSelection} className="animate-content-fade-in flex-1 overflow-hidden">
                        {renderMainContent()}
                    </div>
                </main>
              </ErrorBoundary>
          </div>
        </div>
        
        <ErrorBoundary level="component">
          <ArticleModal 
            isOpen={!!modalArticle}
            article={modalArticle}
            onClose={() => setModalArticle(null)}
            onToggleBookmark={handleToggleArticleBookmark}
            onSetAiSummary={handleSetAiSummaryForModal}
            onSetAiAnalysis={handleSetAiAnalysisForModal}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default CountryDetailPageRefactored;