import React, { useState, useEffect, useMemo } from 'react';
import { CountryMappings } from '../services/countryDataService';
import { MOCK_PORTALS, MOCK_PORTAL_ALERTS } from '../services/mockData';
import PortalLeftSidebar from '../components/portal/PortalLeftSidebar';
import PortalHeader from '../components/portal/PortalHeader';
import PortalSummaryCard from '../components/portal/PortalSummaryCard';
import { NewspaperIcon, BellIcon, SparklesIcon, ChartBarIcon, GlobeAltIcon, BookmarkIcon } from '../components/Icons';
import AIBriefPanel from '../components/portal/AIBriefPanel';
import NewsFeedPanel from '../components/portal/NewsFeedPanel';
import PortalRightSidebar from '../components/portal/PortalRightSidebar';
import CreatePortalModal from '../components/portal/CreatePortalModal';
import ConfirmModal from '../components/admin/ConfirmModal';
import { Portal, Article, Source, PortalSummaryStats, Topic } from '../types';
import RotatingGlobe from '../components/RotatingGlobe';
import AnalysisPanel from '../components/portal/AnalysisPanel';

interface UserPortalPageProps {
  setView: (view: { name: string; context?: any }) => void;
  countryMappings: CountryMappings;
  allArticles: Article[];
  allSources: Source[];
}

const PORTALS_STORAGE_KEY = 'govnews_user_portals';

const UserPortalPage: React.FC<UserPortalPageProps> = ({ setView, countryMappings, allArticles, allSources }) => {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [selectedPortalId, setSelectedPortalId] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortal, setEditingPortal] = useState<Portal | undefined>(undefined);
  const [portalToDelete, setPortalToDelete] = useState<Portal | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'analysis'>('feed');

  // Load portals from localStorage on initial mount
  useEffect(() => {
    try {
      const savedPortals = localStorage.getItem(PORTALS_STORAGE_KEY);
      if (savedPortals) {
        const parsedPortals = JSON.parse(savedPortals);
        setPortals(parsedPortals);
        if (parsedPortals.length > 0 && !selectedPortalId) {
          setSelectedPortalId(parsedPortals[0].id);
        }
      } else {
        // First time load, initialize with mock data
        setPortals(MOCK_PORTALS);
        setSelectedPortalId(MOCK_PORTALS[0]?.id || null);
      }
    } catch (error) {
      console.error("Failed to load portals from localStorage", error);
      setPortals(MOCK_PORTALS);
      setSelectedPortalId(MOCK_PORTALS[0]?.id || null);
    }
  }, []);

  // Save portals to localStorage whenever they change
  useEffect(() => {
    try {
        if(portals.length > 0) {
             localStorage.setItem(PORTALS_STORAGE_KEY, JSON.stringify(portals));
        }
    } catch (error) {
      console.error("Failed to save portals to localStorage", error);
    }
  }, [portals]);


  const selectedPortal = portals.find(p => p.id === selectedPortalId);

  const { filteredArticles, summaryStats } = useMemo(() => {
    if (!selectedPortal) return { filteredArticles: [], summaryStats: null };

    const portalCountryCodes = new Set(selectedPortal.countries.map(c => countryMappings.turkishToCca2.get(c)?.toLowerCase()).filter(Boolean));
    
    const articles = allArticles.filter(article => {
        const articleCountryCode = article.source_id.split('_')[0];
        const countryMatch = portalCountryCodes.has(articleCountryCode);
        if (!countryMatch) return false;
        
        const topicMatch = selectedPortal.topics.length === 0 || article.topics.some(t => selectedPortal.topics.includes(t));
        return topicMatch;
    });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const newItems24h = articles.filter(a => new Date(a.published_at) > oneDayAgo).length;
    const sourcesCount = new Set(articles.map(a => a.source_id)).size;
    
    const topicCounts = articles.flatMap(a => a.topics).reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
    }, {} as Record<Topic, number>);
    
    const topTopics = Object.entries(topicCounts).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([topic, count]) => ({ topic: topic as Topic, count }));

    const breakingAlerts = MOCK_PORTAL_ALERTS.filter(a => a.portalId === selectedPortal.id && a.severity === 'high').length;
    const sentimentTrend = Math.random() > 0.5 ? 1 : -1; // Mock: 1 for up, -1 for down
    const unreadItems = Math.floor(articles.length * Math.random());

    const stats: PortalSummaryStats = { newItems24h, sourcesCount, topTopics, breakingAlerts, sentimentTrend, unreadItems };
    
    return { filteredArticles: articles, summaryStats: stats };
  }, [selectedPortal, allArticles, countryMappings]);


  const handleCreatePortal = () => {
    setEditingPortal(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditPortal = (portal: Portal) => {
    setEditingPortal(portal);
    setIsModalOpen(true);
  };
  
  const handleSavePortal = (portalData: Omit<Portal, 'id' | 'ownerId' | 'createdAt' | 'lastUpdatedAt'> & { id?: string }) => {
    if (portalData.id) {
        setPortals(portals.map(p => p.id === portalData.id ? { ...p, ...portalData, lastUpdatedAt: new Date().toISOString() } : p));
    } else {
        const newPortal: Portal = {
            ...portalData,
            id: `portal_${Date.now()}`,
            ownerId: 'user_1',
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
        };
        setPortals([newPortal, ...portals]);
        setSelectedPortalId(newPortal.id);
    }
    setIsModalOpen(false);
  };

  const handleDeletePortal = () => {
    if (!portalToDelete) return;

    const newPortals = portals.filter(p => p.id !== portalToDelete.id);
    setPortals(newPortals);
    
    if(selectedPortalId === portalToDelete.id) {
        setSelectedPortalId(newPortals[0]?.id || null);
    }
    setPortalToDelete(null);
  }

  return (
    <div className="min-h-screen font-sans bg-analyst-dark-bg text-analyst-text-primary">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
          <RotatingGlobe />
        </div>
        
        <div className={`relative z-10 grid transition-all duration-300 ${isFocusMode ? 'grid-cols-12' : 'grid-cols-12 lg:gap-6'}`}>
          <aside className={`transition-all duration-300 ${isFocusMode ? 'w-0 opacity-0 lg:w-0' : 'col-span-3 lg:col-span-2'}`}>
            {!isFocusMode && <PortalLeftSidebar portals={portals} selectedPortalId={selectedPortalId} onSelectPortal={setSelectedPortalId} onCreatePortal={handleCreatePortal} onDeletePortal={setPortalToDelete} setView={setView} />}
          </aside>

          <main className={`transition-all duration-300 ${isFocusMode ? 'col-span-12' : 'col-span-9 lg:col-span-7'}`}>
             <div className="p-0 md:py-6 md:pr-6 h-screen flex flex-col gap-6">
                {selectedPortal && <PortalHeader portal={selectedPortal} onToggleFocusMode={() => setIsFocusMode(!isFocusMode)} onEditPortal={() => handleEditPortal(selectedPortal)} />}
                
                 <div className="flex-grow overflow-y-auto pr-2">
                    <div className="space-y-6">
                        {summaryStats && (
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <PortalSummaryCard title="New Items (24h)" value={summaryStats.newItems24h} icon={<NewspaperIcon className="w-5 h-5 text-analyst-accent" />} />
                                <PortalSummaryCard title="Breaking Alerts" value={summaryStats.breakingAlerts} icon={<BellIcon className="w-5 h-5 text-analyst-orange" />} />
                                <PortalSummaryCard title="Top Topic" value={summaryStats.topTopics[0]?.topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'} icon={<SparklesIcon className="w-5 h-5 text-analyst-purple" />} />
                                <PortalSummaryCard title="Sentiment Trend" value={summaryStats.sentimentTrend > 0 ? 'Positive' : 'Negative'} icon={<ChartBarIcon className="w-5 h-5 text-analyst-green" />} />
                                <PortalSummaryCard title="Sources" value={summaryStats.sourcesCount} icon={<GlobeAltIcon className="w-5 h-5 text-teal-500" />} />
                                <PortalSummaryCard title="Unread Items" value={summaryStats.unreadItems} icon={<BookmarkIcon className="w-5 h-5 text-indigo-500" />} />
                            </div>
                        )}
                        <AIBriefPanel articles={filteredArticles} />

                        <div className="flex-shrink-0 border-b border-analyst-border/50 px-4">
                            <nav className="-mb-px flex space-x-6">
                                <button
                                    onClick={() => setActiveTab('feed')}
                                    className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === 'feed' ? 'border-analyst-accent text-analyst-accent' : 'border-transparent text-analyst-text-secondary hover:text-analyst-text-primary'}`}
                                >
                                    Feed
                                </button>
                                <button
                                    onClick={() => setActiveTab('analysis')}
                                    className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === 'analysis' ? 'border-analyst-accent text-analyst-accent' : 'border-transparent text-analyst-text-secondary hover:text-analyst-text-primary'}`}
                                >
                                    Analysis
                                </button>
                            </nav>
                        </div>
                        
                        {activeTab === 'feed' && <NewsFeedPanel feed={filteredArticles} />}
                        {activeTab === 'analysis' && <AnalysisPanel articles={filteredArticles} />}
                    </div>
                </div>
            </div>
          </main>

          <aside className={`transition-all duration-300 ${isFocusMode ? 'w-0 opacity-0' : 'hidden lg:block lg:col-span-3'}`}>
             {!isFocusMode && selectedPortal && <PortalRightSidebar portal={selectedPortal} alerts={MOCK_PORTAL_ALERTS} countryMappings={countryMappings} setView={setView} />}
          </aside>
        </div>
      </div>
       <CreatePortalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePortal}
        portal={editingPortal}
        countryMappings={countryMappings}
      />
       <ConfirmModal
        isOpen={!!portalToDelete}
        onClose={() => setPortalToDelete(null)}
        onConfirm={handleDeletePortal}
        title="Delete Portal"
        message={`Are you sure you want to delete the "${portalToDelete?.name}" portal? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default UserPortalPage;
