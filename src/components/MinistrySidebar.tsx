import React from 'react';
import { BuildingOfficeIcon, SettingsIcon, Bars3Icon, BookmarkIcon, FireIcon, UsersIcon, ClockIcon, NewspaperIcon, BookOpenIcon, ChartBarIcon, CloudIcon, LifebuoyIcon, ChartPieIcon, RoadIcon, BeakerIcon, ChatBubbleLeftRightIcon } from './Icons';
import { CountryMappings } from '../services/countryData.service';

type ActiveSelection = 'all' | 'bookmarks' | 'conflicts' | 'gdelt' | 'nationalPress' | 'factbook' | 'worldBank' | 'oecd' | 'noaa' | 'reliefWeb' | 'populationPyramid' | 'osm' | 'socialMedia' | string;
type Category = 'official' | 'intelligence' | 'data';

interface MinistrySidebarProps {
  countryName: string;
  englishCountryName: string;
  ministries: string[];
  activeSelection: ActiveSelection;
  onSelect: (selection: ActiveSelection) => void;
  bookmarkCount: number;
  countryMappings: CountryMappings;
  activeCategory: Category;
  setView: (view: { name: string; context?: any }) => void;
}

interface DataSourceItem {
    id: string;
    name: string;
    icon: JSX.Element;
    color: string;
}

const getSourceIcon = (sourceName: string) => {
    const lowerName = sourceName.toLowerCase();
    if (lowerName.includes('bakanlığı') || lowerName.includes('ministry') || lowerName.includes('department') || lowerName.includes('departmanı') || lowerName.includes('sekreterliği') || lowerName.includes('komisyonu')) {
        return <BuildingOfficeIcon className="h-5 w-5 text-analyst-text-secondary group-hover:text-analyst-accent transition-colors" />;
    }
    if (lowerName.includes('cumhurbaşkanlığı') || lowerName.includes('president') || lowerName.includes('başkanlık') || lowerName.includes('white house') || lowerName.includes('kremlin') || lowerName.includes('ofisi')) {
        return <UsersIcon className="h-5 w-5 text-analyst-text-secondary group-hover:text-analyst-accent transition-colors" />;
    }
    return <Bars3Icon className="h-5 w-5 text-analyst-text-secondary group-hover:text-analyst-accent transition-colors" />;
}

const formatMinistryKey = (key: string): string => {
  const name = key.substring(key.indexOf('.') + 1);
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const MinistrySidebar: React.FC<MinistrySidebarProps> = ({ countryName, englishCountryName, ministries, activeSelection, onSelect, bookmarkCount, countryMappings, activeCategory, setView }) => {
  const legislativeInfo = countryMappings.turkishToLegislativeInfo.get(countryName);
  const flagUrl = countryMappings.turkishToFlagUrl.get(countryName);

  const dataSources: { intelligence: DataSourceItem[]; data: DataSourceItem[] } = {
    intelligence: [
        { id: 'socialMedia', name: 'Social Media Feed', icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, color: 'sky' },
        { id: 'conflicts', name: 'Conflict Report', icon: <FireIcon className="h-5 w-5" />, color: 'red' },
        { id: 'gdelt', name: 'Global Media Watch', icon: <ClockIcon className="h-5 w-5" />, color: 'amber' },
        { id: 'nationalPress', name: 'National Press', icon: <NewspaperIcon className="h-5 w-5" />, color: 'purple' },
    ],
    data: [
        { id: 'factbook', name: 'Country Profile', icon: <BookOpenIcon className="h-5 w-5" />, color: 'indigo' },
        { id: 'worldBank', name: 'Economic Indicators', icon: <ChartBarIcon className="h-5 w-5" />, color: 'green' },
        { id: 'oecd', name: 'OECD Economic Outlook', icon: <ChartBarIcon className="h-5 w-5" />, color: 'cyan' },
        { id: 'osm', name: 'Road Network', icon: <RoadIcon className="h-5 w-5" />, color: 'orange' },
        { id: 'noaa', name: 'Climate & Environment', icon: <CloudIcon className="h-5 w-5" />, color: 'teal' },
        { id: 'reliefWeb', name: 'Humanitarian Updates', icon: <LifebuoyIcon className="h-5 w-5" />, color: 'rose' },
        { id: 'populationPyramid', name: 'Population Pyramid', icon: <ChartPieIcon className="h-5 w-5" />, color: 'pink' },
    ]
  };

  const colorClasses: Record<string, Record<string, string>> = {
      sky: { active: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400', icon: 'text-sky-500 dark:text-sky-400'},
      red: { active: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400', icon: 'text-red-500 dark:text-red-400'},
      amber: { active: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', icon: 'text-amber-500 dark:text-amber-400'},
      purple: { active: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400', icon: 'text-purple-500 dark:text-purple-400'},
      indigo: { active: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400', icon: 'text-indigo-500 dark:text-indigo-400'},
      green: { active: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', icon: 'text-green-500 dark:text-green-400'},
      cyan: { active: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400', icon: 'text-cyan-500 dark:text-cyan-400'},
      orange: { active: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400', icon: 'text-orange-500 dark:text-orange-400'},
      teal: { active: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400', icon: 'text-teal-500 dark:text-teal-400'},
      rose: { active: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400', icon: 'text-rose-500 dark:text-rose-400'},
      pink: { active: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400', icon: 'text-pink-500 dark:text-pink-400'},
  };

  const renderDataSourceButtons = (sources: DataSourceItem[]) => {
      return sources.map(source => {
          const isActive = activeSelection === source.id;
          const colors = colorClasses[source.color] || {};
          return (
             <button
                key={source.id}
                onClick={() => onSelect(source.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-md text-left transition-colors group ${
                isActive
                    ? colors.active
                    : 'text-slate-700 dark:text-analyst-text-primary hover:bg-slate-100/70 dark:hover:bg-analyst-item-hover'
                }`}
            >
                {React.cloneElement(source.icon, { className: `h-5 w-5 transition-colors ${isActive ? colors.icon : 'text-analyst-text-secondary'}`})}
                <span className={`truncate ${isActive ? 'font-semibold' : ''}`}>{source.name}</span>
            </button>
          )
      });
  };

  return (
    <aside className="sticky top-20">
      <div className="bg-white/70 dark:bg-analyst-sidebar/80 backdrop-blur-xl border border-white/20 dark:border-analyst-border/50 shadow-lg rounded-lg p-3 flex flex-col h-full transition-all duration-300">
        <div className="p-2 mb-3">
            <div className="flex items-center gap-4">
                {flagUrl ? (
                  <img src={flagUrl} alt={`Flag of ${englishCountryName}`} className="w-10 h-auto rounded-md object-contain shadow-lg border border-slate-200 dark:border-analyst-border" />
                ) : (
                  <span className="text-3xl">🏳️</span>
                )}
                <h2 className="font-bold text-xl text-slate-900 dark:text-analyst-text-primary">{englishCountryName}</h2>
            </div>
        </div>
        
        <div className="border-t border-slate-200/80 dark:border-analyst-border -mx-3 mb-3"></div>

        {activeCategory === 'official' && legislativeInfo && (legislativeInfo.yasama_organi_sitesi || legislativeInfo.resmi_gazete_sitesi) && (
            <div className="space-y-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-analyst-border text-sm px-1">
                {legislativeInfo.yasama_organi_sitesi && (
                    <a href={legislativeInfo.yasama_organi_sitesi} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md text-slate-600 dark:text-analyst-text-secondary hover:bg-slate-100/70 dark:hover:bg-analyst-item-hover group">
                        <BuildingOfficeIcon className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-analyst-text-secondary group-hover:text-analyst-text-primary transition-colors" />
                        <div className="overflow-hidden">
                            <p className="font-semibold text-slate-700 dark:text-analyst-text-primary">Legislative Body</p>
                            <p className="text-xs text-slate-500 dark:text-analyst-text-secondary truncate" title={legislativeInfo.yasama_organi}>{legislativeInfo.yasama_organi}</p>
                        </div>
                    </a>
                )}
                {legislativeInfo.resmi_gazete_sitesi && (
                    <a href={legislativeInfo.resmi_gazete_sitesi} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md text-slate-600 dark:text-analyst-text-secondary hover:bg-slate-100/70 dark:hover:bg-analyst-item-hover group">
                        <BookOpenIcon className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-analyst-text-secondary group-hover:text-analyst-text-primary transition-colors" />
                         <div className="overflow-hidden">
                            <p className="font-semibold text-slate-700 dark:text-analyst-text-primary">Official Gazette</p>
                            <p className="text-xs text-slate-500 dark:text-analyst-text-secondary truncate" title={legislativeInfo.resmi_gazete}>{legislativeInfo.resmi_gazete}</p>
                        </div>
                    </a>
                )}
            </div>
        )}

        <nav className="flex-grow space-y-1.5 px-1">
          {activeCategory === 'official' && (
            <>
            <button
                onClick={() => onSelect('all')}
                className={`w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-md text-left transition-colors group ${
                activeSelection === 'all'
                    ? 'bg-analyst-accent/10 text-analyst-accent'
                    : 'text-slate-700 dark:text-analyst-text-primary hover:bg-slate-100/70 dark:hover:bg-analyst-item-hover'
                }`}
            >
                <Bars3Icon className={`h-5 w-5 transition-colors ${activeSelection === 'all' ? 'text-analyst-accent' : 'text-analyst-text-secondary'}`} />
                <span className="truncate">All Sources</span>
            </button>

            <button
                onClick={() => onSelect('bookmarks')}
                className={`w-full flex items-center justify-between space-x-3 px-3 py-3 text-sm font-medium rounded-md text-left transition-colors group ${
                activeSelection === 'bookmarks'
                    ? 'bg-analyst-accent/10 text-analyst-accent'
                    : 'text-slate-700 dark:text-analyst-text-primary hover:bg-slate-100/70 dark:hover:bg-analyst-item-hover'
                }`}
            >
                <div className="flex items-center space-x-3">
                <BookmarkIcon className={`h-5 w-5 transition-colors ${activeSelection === 'bookmarks' ? 'text-analyst-accent' : 'text-analyst-text-secondary'}`} />
                <span className="truncate">Bookmarks</span>
                </div>
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${activeSelection === 'bookmarks' ? 'bg-analyst-accent/20 text-analyst-accent' : 'bg-slate-200 text-slate-600 dark:bg-analyst-input dark:text-analyst-text-secondary'}`}>{bookmarkCount}</span>
            </button>
            </>
          )}

          {activeCategory === 'intelligence' && (
            <>
              {renderDataSourceButtons(dataSources.intelligence)}
            </>
          )}

          {activeCategory === 'data' && (
             renderDataSourceButtons(dataSources.data)
          )}

          {activeCategory === 'official' && ministries.length > 0 && 
            <>
                <div className="pt-2"> <div className="border-t border-slate-200/80 dark:border-analyst-border"></div></div>
                {ministries.map(ministryKey => {
                    const displayName = formatMinistryKey(ministryKey);
                    return (
                        <button
                        key={ministryKey}
                        onClick={() => onSelect(ministryKey)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-md text-left transition-colors group ${
                            activeSelection === ministryKey
                            ? 'bg-analyst-accent/10 text-analyst-accent'
                            : 'text-slate-700 dark:text-analyst-text-primary hover:bg-slate-100/70 dark:hover:bg-analyst-item-hover'
                        }`}
                        >
                        {getSourceIcon(displayName)}
                        <span className="truncate">{displayName}</span>
                        </button>
                    )
                })}
            </>
          }
        </nav>
        <div className="pt-3 mt-auto border-t border-slate-200/80 dark:border-analyst-border mx-1">
           <button
              className="w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium text-slate-700 dark:text-analyst-text-primary hover:bg-slate-100/70 dark:hover:bg-analyst-item-hover rounded-md group"
            >
              <SettingsIcon className="h-5 w-5 text-analyst-text-secondary group-hover:text-analyst-accent transition-colors" />
              <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MinistrySidebar;