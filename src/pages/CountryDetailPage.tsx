import React, { useState, useMemo, useEffect } from 'react';
import { Article, Source, UcdpEvent, ConflictPoint, GdeltArticle, ExternalArticle, FactbookData, WorldBankIndicator, OecdIndicator, NoaaIndicator, ReliefWebUpdate, PopulationPyramidData, OsmData, SocialPost, SocialMediaLinks, Topic, AiAnalysisResult } from '../types';
import MinistrySidebar from '../components/MinistrySidebar';
import ArticleList from '../components/ArticleList';
import ArticleModal from '../components/ArticleModal';
import Header from '../components/Header';
import { ministriesData } from '../data/ministries';
import { fetchConflictEvents } from '../services/ucdp';
import { fetchGdeltArticles } from '../services/gdeltService';
import { fetchNationalPress, createChatSession } from '../services/geminiService';
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
import { setupSwipeGesture } from '../utils/iosGestures';

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


const CountryDetailPage: React.FC<CountryDetailPageProps> = ({ 
    countryName, allArticles, allSources, setView, onToggleBookmark, 
    onSetAiSummary, onSetAiAnalysis, countryMappings, isEmbedded = false 
}) => {
  const [activeSelection, setActiveSelection] = useState<ActiveSelection>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('official');
  const [modalArticle, setModalArticle] = useState<Article | null>(null);
  const [conflictData, setConflictData] = useState<ConflictPoint[]>([]);
  const [isLoadingConflicts, setIsLoadingConflicts] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [gdeltData, setGdeltData] = useState<GdeltArticle[]>([]);
  const [isLoadingGdelt, setIsLoadingGdelt] = useState(false);
  const [gdeltError, setGdeltError] = useState<string | null>(null);
  const [nationalPressArticles, setNationalPressArticles] = useState<ExternalArticle[]>([]);
  const [isLoadingNationalPress, setIsLoadingNationalPress] = useState(false);
  const [factbookData, setFactbookData] = useState<FactbookData | null>(null);
  const [isLoadingFactbook, setIsLoadingFactbook] = useState(false);
  const [worldBankData, setWorldBankData] = useState<WorldBankIndicator[] | null>(null);
  const [isLoadingWorldBank, setIsLoadingWorldBank] = useState(false);
  const [oecdData, setOecdData] = useState<OecdIndicator[] | null>(null);
  const [isLoadingOecd, setIsLoadingOecd] = useState(false);
  const [noaaData, setNoaaData] = useState<NoaaIndicator[] | null>(null);
  const [isLoadingNoaa, setIsLoadingNoaa] = useState(false);
  const [reliefWebData, setReliefWebData] = useState<ReliefWebUpdate[] | null>(null);
  const [isLoadingReliefWeb, setIsLoadingReliefWeb] = useState(false);
  const [populationPyramidData, setPopulationPyramidData] = useState<PopulationPyramidData | null>(null);
  const [isLoadingPopulationPyramid, setIsLoadingPopulationPyramid] = useState(false);
  const [osmData, setOsmData] = useState<OsmData | null>(null);
  const [isLoadingOsm, setIsLoadingOsm] = useState(false);
  const [socialMediaState, setSocialMediaState] = useState<{status: 'idle'|'loading'|'success'|'error', posts: SocialPost[], links: SocialMediaLinks | null}>({status: 'idle', posts:[], links: null});
  const [worldAtlas, setWorldAtlas] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<{population: number | null, gdp: number | null, latestEventDate: string | null}>({ population: null, gdp: null, latestEventDate: null });
  
  const englishCountryName = useMemo(() => countryMappings.turkishToEnglish.get(countryName) || countryName, [countryName, countryMappings]);

  const handleSetCategory = (category: Category) => {
    setActiveCategory(category);
    if (category === 'official') {
      setActiveSelection('all');
    } else if (category === 'intelligence') {
      setActiveSelection('socialMedia');
    } else if (category === 'data') {
      setActiveSelection('factbook');
    }
  };
  
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(data => setWorldAtlas(data))
      .catch(err => console.error("Failed to load world atlas:", err));
  }, []);

  const countryGeography = useMemo(() => {
    if (!worldAtlas) return null;

    return worldAtlas.objects.countries.geometries.find((g: any) => {
        const geoName = (g.properties.name || g.properties.NAME || g.properties.NAME_LONG);
        if (!geoName) return false;
        
        const normalizedGeoName = geoName.trim().toLowerCase();
        return countryMappings.geoJsonNameToTurkish.get(normalizedGeoName) === countryName;
    });
  }, [worldAtlas, countryName, countryMappings]);

  useEffect(() => {
    // Reset view when country changes
    setActiveSelection(null);
    setActiveCategory('official');
    setModalArticle(null);
    setConflictData([]);
    setConflictError(null);
    setGdeltData([]);
    setGdeltError(null);
    setNationalPressArticles([]);
    setFactbookData(null);
    setWorldBankData(null);
    setOecdData(null);
    setNoaaData(null);
    setReliefWebData(null);
    setPopulationPyramidData(null);
    setOsmData(null);
    setSocialMediaState({status: 'idle', posts:[], links: null});
  }, [countryName]);

  // Effect for dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
        const cca3 = countryMappings.turkishToCca3.get(countryName);
        const ucdpName = countryMappings.turkishToUcdpName.get(countryName);
        
        let pop: number | null = null, gdp: number | null = null, eventDate: string | null = null;

        if (cca3) {
            const wbData = await fetchWorldBankData(cca3);
            pop = wbData.find(d => d.indicatorCode === 'SP.POP.TOTL')?.value ?? null;
            gdp = wbData.find(d => d.indicatorCode === 'NY.GDP.MKTP.CD')?.value ?? null;
        }
        if (ucdpName) {
            try {
                const conflicts = await fetchConflictEvents(ucdpName);
                if (conflicts.length > 0) {
                    eventDate = conflicts[0].date;
                }
            } catch (e) {
                console.error("Could not fetch latest event date for dashboard", e);
            }
        }
        setDashboardData({ population: pop, gdp: gdp, latestEventDate: eventDate });
    };
    loadDashboardData();
  }, [countryName, countryMappings]);


  useEffect(() => {
    if (activeSelection === 'conflicts') {
        const loadConflicts = async () => {
            setIsLoadingConflicts(true);
            setConflictError(null);
            try {
                const ucdpName = countryMappings.turkishToUcdpName.get(countryName);
                if (ucdpName) {
                    const events = await fetchConflictEvents(ucdpName);
                    setConflictData(events);
                } else {
                     const message = `No UCDP name mapping found for ${countryName}`;
                     console.warn(message);
                     setConflictData([]);
                     setConflictError(message);
                }
            } catch (error) {
                console.error("Failed to fetch UCDP data for " + countryName + ":", error);
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setConflictError(errorMessage);
                setConflictData([]); // Clear data on error
            } finally {
                setIsLoadingConflicts(false);
            }
        };
        loadConflicts();
    } else if (activeSelection === 'gdelt') {
        const loadGdeltData = async () => {
            setIsLoadingGdelt(true);
            setGdeltError(null);
            try {
                if(englishCountryName) {
                    const articles = await fetchGdeltArticles(englishCountryName);
                    setGdeltData(articles);
                } else {
                    console.warn(`No English name mapping for ${countryName} for GDELT`);
                    setGdeltData([]);
                }
            } catch(error) {
                setGdeltError(error instanceof Error ? error.message : "An unknown error occurred");
                setGdeltData([]);
            } finally {
                setIsLoadingGdelt(false);
            }
        };
        loadGdeltData();
    } else if (activeSelection === 'nationalPress') {
        const loadNationalPress = async () => {
            setIsLoadingNationalPress(true);
            try {
                const articles = await fetchNationalPress(countryName, countryMappings);
                setNationalPressArticles(articles);
            } catch (error) {
                console.error("Failed to fetch national press data from Gemini:", error);
                setNationalPressArticles([]);
            } finally {
                setIsLoadingNationalPress(false);
            }
        };
        loadNationalPress();
    } else if (activeSelection === 'factbook') {
        const loadFactbookData = async () => {
            setIsLoadingFactbook(true);
            setFactbookData(null);
            try {
                if (englishCountryName) {
                    let slug = slugify(englishCountryName);
                    // Special case for United States as its common name differs from its slug
                    if (englishCountryName === 'United States of America') {
                        slug = 'united-states';
                    }
                    const data = await fetchCountryProfileFactbook(slug);
                    setFactbookData(data);
                } else {
                    console.warn(`No English name mapping for ${countryName} for Factbook`);
                    setFactbookData({ country_name: countryName, profile: {}, error: 'Country mapping not found' });
                }
            } catch (error) {
                console.error("Failed to fetch Factbook data:", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                setFactbookData({ country_name: countryName, profile: {}, error: errorMessage });
            } finally {
                setIsLoadingFactbook(false);
            }
        };
        loadFactbookData();
    } else if (activeSelection === 'worldBank') {
        const loadWorldBankData = async () => {
            setIsLoadingWorldBank(true);
            setWorldBankData(null);
            try {
                const cca3 = countryMappings.turkishToCca3.get(countryName);
                if (cca3) {
                    const data = await fetchWorldBankData(cca3);
                    setWorldBankData(data);
                } else {
                    console.warn(`No CCA3 code found for ${countryName}`);
                    setWorldBankData([]);
                }
            } catch (error) {
                 console.error("Failed to fetch World Bank data:", error);
                 setWorldBankData([]);
            } finally {
                setIsLoadingWorldBank(false);
            }
        };
        loadWorldBankData();
    } else if (activeSelection === 'oecd') {
        const loadOecdData = async () => {
            setIsLoadingOecd(true);
            setOecdData(null);
            try {
                const cca3 = countryMappings.turkishToCca3.get(countryName);
                if (cca3) {
                    const data = await fetchOecdData(cca3);
                    setOecdData(data);
                } else {
                    console.warn(`No CCA3 code found for ${countryName} for OECD`);
                    setOecdData([]);
                }
            } catch (error) {
                 console.error("Failed to fetch OECD data:", error);
                 setOecdData([]);
            } finally {
                setIsLoadingOecd(false);
            }
        };
        loadOecdData();
    } else if (activeSelection === 'noaa') {
        const loadNoaaData = async () => {
            setIsLoadingNoaa(true);
            setNoaaData(null);
            try {
                const cca2 = countryMappings.turkishToCca2.get(countryName);
                if (cca2) {
                    const data = await fetchNoaaData(cca2);
                    setNoaaData(data);
                } else {
                     console.warn(`No CCA2/FIPS code found for ${countryName}`);
                     setNoaaData([]);
                }
            } catch (error) {
                 console.error("Failed to fetch NOAA data:", error);
                 setNoaaData([]);
            } finally {
                setIsLoadingNoaa(false);
            }
        };
        loadNoaaData();
    } else if (activeSelection === 'reliefWeb') {
        const loadReliefWebData = async () => {
            setIsLoadingReliefWeb(true);
            setReliefWebData(null);
            try {
                const cca3 = countryMappings.turkishToCca3.get(countryName);
                if (cca3) {
                    const data = await fetchReliefWebUpdates(cca3, englishCountryName);
                    setReliefWebData(data);
                } else {
                     console.warn(`No CCA3 code found for ${countryName}`);
                     setReliefWebData([]);
                }
            } catch (error) {
                 console.error("Failed to fetch ReliefWeb data:", error);
                 setReliefWebData([]);
            } finally {
                setIsLoadingReliefWeb(false);
            }
        };
        loadReliefWebData();
    } else if (activeSelection === 'populationPyramid') {
      const loadData = async () => {
          setIsLoadingPopulationPyramid(true);
          setPopulationPyramidData(null);
          try {
              if (englishCountryName) {
                  const data = await fetchPopulationPyramidData(englishCountryName);
                  setPopulationPyramidData(data);
              } else {
                  console.warn(`No English name mapping for ${countryName} for Population Pyramid`);
                  setPopulationPyramidData({ country: countryName, year: 0, totalPopulation: 0, pyramid: [], message: 'Country name not mapped' });
              }
          } catch (error) {
               console.error("Failed to fetch Population Pyramid data:", error);
               const message = error instanceof Error ? error.message : "Failed to fetch";
               setPopulationPyramidData({ country: countryName, year: 0, totalPopulation: 0, pyramid: [], message });
          } finally {
              setIsLoadingPopulationPyramid(false);
          }
      };
      loadData();
    } else if (activeSelection === 'osm') {
        const loadOsmData = async () => {
            setIsLoadingOsm(true);
            setOsmData(null);
            try {
                if (englishCountryName) {
                    const data = await fetchCountryRoads(englishCountryName);
                    setOsmData(data);
                } else {
                    console.warn(`No English name mapping for ${countryName} for OpenStreetMap`);
                    setOsmData({ country: countryName, data: [], message: 'Country name not mapped' });
                }
            } catch (error) {
                console.error("Failed to fetch OpenStreetMap data:", error);
                const message = error instanceof Error ? error.message : "Failed to fetch";
                setOsmData({ country: countryName, data: [], message });
            } finally {
                setIsLoadingOsm(false);
            }
        };
        loadOsmData();
    } else if (activeSelection === 'socialMedia') {
        const loadSocialMedia = async () => {
            const links = socialMediaData[countryName] || null;
            setSocialMediaState({ status: 'loading', posts: [], links });
            if (!links || (!links.x && !links.youtube)) {
                setSocialMediaState({ status: 'error', posts: [], links });
                return;
            }
            try {
                const posts = await fetchAllSocialMedia(links);
                posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
                setSocialMediaState({ status: 'success', posts, links });
            } catch (error) {
                console.error("Failed to fetch social media data:", error);
                setSocialMediaState({ status: 'error', posts: [], links });
            }
        };
        loadSocialMedia();
    }
  }, [activeSelection, countryName, countryMappings, englishCountryName]);

  const countryData = useMemo(() => {
    // This logic needs to adapt to translation keys.
    // We assume `allSources.name` is a key like `source.tr.tccb`.
    // The country name is Turkish. A source belongs to a country if its key starts with the country code.
    const countryCode = countryMappings.turkishToCca2.get(countryName)?.toLowerCase();
    
    const sourcesForCountry = allSources.filter(s => {
        // e.g., source.tr.tccb -> tr
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
    
    // Fallback for any other selection that isn't a special panel
    if (activeSelection && !Object.keys(ministryToTopicMap).includes(activeSelection)) {
        // This handles potential direct source selections if UI is extended later
        return countryData.articlesForCountry.filter(a => a.source_name === activeSelection);
    }

    return [];
  }, [activeSelection, countryData]);

  const handleSelect = (selection: ActiveSelection) => {
    setActiveSelection(selection);
  };
  
  const handleSelectArticle = (article: Article) => {
    const fullArticleData = allArticles.find(a => a.article_id === article.article_id) || article;
    setModalArticle(fullArticleData);
  };

  const handleToggleArticleBookmark = (articleId: string) => {
    onToggleBookmark(articleId);
    if (modalArticle?.article_id === articleId) {
        setModalArticle(prev => prev ? { ...prev, bookmarked: !prev.bookmarked } : null);
    }
  };
  
  const handleSetAiSummaryForModal = (summary: string) => {
    if (modalArticle) {
        onSetAiSummary(modalArticle.article_id, summary);
        setModalArticle(prev => prev ? { ...prev, summary_ai: summary } : null);
    }
  };

  const handleSetAiAnalysisForModal = (analysis: AiAnalysisResult) => {
    if (modalArticle) {
        onSetAiAnalysis(modalArticle.article_id, analysis);
        setModalArticle(prev => prev ? { ...prev, ai_analysis: analysis } : null);
    }
  };


  const renderMainContent = () => {
      if (activeSelection === null) {
        return (
            <CountryWelcomeDisplay
                countryName={englishCountryName}
                geography={countryGeography}
                worldAtlas={worldAtlas}
                coordinates={coordinates}
                countryMappings={countryMappings}
            />
        );
      }
      if (activeSelection === 'conflicts') {
          if (isLoadingConflicts) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          return <ConflictInfoPanel events={conflictData} countryName={englishCountryName} error={conflictError} />;
      }
      if (activeSelection === 'gdelt') {
          return (
            <div className="h-full flex flex-col">
                <div className="p-6 md:p-8 border-b border-slate-200/70 dark:border-analyst-border/50 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-analyst-text-primary">Global Media Watch</h2>
                    <p className="text-slate-500 dark:text-analyst-text-secondary mt-1">{`Recent articles from global media sources mentioning ${englishCountryName}`}</p>
                </div>
                {isLoadingGdelt ? (
                    <div className="flex-grow flex justify-center items-center"><Spinner /></div>
                ) : (
                    <GdeltInfoPanel articles={gdeltData} countryName={englishCountryName} error={gdeltError} />
                )}
            </div>
        );
      }
       if (activeSelection === 'nationalPress') {
          if (isLoadingNationalPress) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          return <NationalPressPanel articles={nationalPressArticles} countryName={englishCountryName} />;
      }
       if (activeSelection === 'factbook') {
          if (isLoadingFactbook) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          if (factbookData) {
              return <FactbookPanel data={factbookData} countryName={englishCountryName} />;
          }
          return null; // Should be covered by loading/data state
      }
      if (activeSelection === 'worldBank') {
          if (isLoadingWorldBank) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          if (worldBankData) {
              return <WorldBankPanel data={worldBankData} countryName={englishCountryName} />;
          }
          return null;
      }
       if (activeSelection === 'oecd') {
          if (isLoadingOecd) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          if (oecdData) {
              return <OecdPanel data={oecdData} countryName={englishCountryName} />;
          }
          return null;
      }
      if (activeSelection === 'noaa') {
          if (isLoadingNoaa) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          if (noaaData) {
              return <NoaaPanel data={noaaData} countryName={englishCountryName} />;
          }
          return null;
      }
      if (activeSelection === 'reliefWeb') {
          if (isLoadingReliefWeb) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          if (reliefWebData) {
              return <ReliefWebPanel updates={reliefWebData} countryName={englishCountryName} />;
          }
          return null;
      }
      if (activeSelection === 'populationPyramid') {
          if (isLoadingPopulationPyramid) {
              return <div className="flex justify-center items-center h-full min-h-[40vh]"><Spinner /></div>;
          }
          if (populationPyramidData) {
              return <PopulationPyramidPanel data={populationPyramidData} countryName={englishCountryName} />;
          }
          return null;
      }
      if (activeSelection === 'osm') {
          const latLng = countryMappings.turkishToLatLng.get(countryName);
          // The OsmRoadsPanel handles its own loading and error states internally.
          // We just need to ensure we have the map center coordinates.
          if (!latLng) {
              return (
                 <div className="text-center p-16">
                    <p className="text-slate-500 dark:text-analyst-text-secondary">{`Map coordinates not available for ${englishCountryName}.`}</p>
                 </div>
              );
          }
          return <OsmRoadsPanel data={osmData} countryName={englishCountryName} center={latLng} isLoading={isLoadingOsm} />;
      }
      if (activeSelection === 'socialMedia') {
        if (socialMediaState.status === 'loading') {
            return <div className="flex flex-col justify-center items-center h-full min-h-[60vh]">
                        <Spinner />
                        <p className="mt-4 text-slate-500 dark:text-analyst-text-secondary">Fetching social media posts...</p>
                   </div>;
        }
        return <SocialMediaPanel 
                    status={socialMediaState.status} 
                    posts={socialMediaState.posts} 
                    links={socialMediaState.links}
                    countryName={englishCountryName} 
                />
      }
      return <ArticleList articles={filteredArticles} onArticleSelect={handleSelectArticle} onToggleBookmark={onToggleBookmark} />;
  }

  const flagUrl = countryMappings.turkishToFlagUrl.get(countryName);
  const coordinates = countryMappings.turkishToLatLng.get(countryName);

  return (
    <div className={`relative ${isEmbedded ? 'h-full' : 'min-h-screen'}`}>
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
        <AnimatedFlagBackground 
            flagUrl={flagUrl} 
            countryName={englishCountryName} 
            geography={countryGeography}
            worldAtlas={worldAtlas}
            coordinates={coordinates}
        />
      )}
      
      {!isEmbedded && <Header onNavigateBack={() => setView({ name: 'landing' })} activeCategory={activeCategory} onSetCategory={handleSetCategory} />}
      
      <div className={`max-w-screen-xl mx-auto p-4 ${isEmbedded ? 'pt-0' : ''}`}>
        {!isEmbedded && (
            <MiniDashboard 
                population={dashboardData.population}
                gdp={dashboardData.gdp}
                latestEventDate={dashboardData.latestEventDate}
            />
        )}
        <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
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
            <main className="col-span-12 md:col-span-8 lg:col-span-9 bg-white/70 dark:bg-analyst-dark-bg/80 backdrop-blur-xl border border-white/20 dark:border-analyst-border/50 rounded-lg shadow-2xl overflow-hidden min-h-[calc(100vh-20rem)]">
                {!isEmbedded && activeCategory === 'official' && <Timeline articles={countryData.articlesForCountry} onArticleSelect={handleSelectArticle} />}
                <div key={activeSelection} className="animate-content-fade-in h-full">
                    {renderMainContent()}
                </div>
            </main>
        </div>
      </div>
       <ArticleModal 
        isOpen={!!modalArticle}
        article={modalArticle}
        onClose={() => setModalArticle(null)}
        onToggleBookmark={handleToggleArticleBookmark}
        onSetAiSummary={handleSetAiSummaryForModal}
        onSetAiAnalysis={handleSetAiAnalysisForModal}
      />
    </div>
  );
};

export default CountryDetailPage;

const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (containerRef.current) {
    // Setup iOS swipe gesture to go back
    const cleanup = setupSwipeGesture(containerRef.current, () => {
      onNavigateBack();
    });
    
    return cleanup;
  }
}, [onNavigateBack]);

return (
  <div ref={containerRef} className="min-h-screen bg-white dark:bg-analyst-dark-bg pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right">
    {/* ... existing component JSX ... */}
  </div>
);
};