import React, { useMemo, useState, KeyboardEvent, useRef, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { SearchIcon, ShieldCheckIcon, BeakerIcon, ArrowsRightLeftIcon, BuildingLibraryIcon, ChevronDownIcon, UserCircleIcon, GlobeAltIcon, GridIcon, ArrowRightOnRectangleIcon } from '../components/Icons';
import CountrySelectorModal from '../components/CountrySelectorModal';
import { CountryMappings } from '../services/countryDataService';
import { performAiSearch } from '../services/geminiService';
import { AiSearchResult } from '../types';
import AISearchModal from '../components/AISearchModal';
import ThemeToggleButton from '../components/ThemeToggleButton';
import RotatingGlobe from '../components/RotatingGlobe';
import RotatingMoon from '../components/RotatingMoon';
import OrganizationsPanel from '../components/OrganizationsPanel';
import { useAuth } from '../hooks/useAuth';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from "react-i18next";

// Import the new MobileNavigation component
import MobileNavigation from '../components/MobileNavigation';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const Star: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute rounded-full bg-slate-200 dark:bg-slate-300" style={style} />
);

interface LandingPageProps {
  setView: (view: { name: string; context?: any }) => void;
  countryMappings: CountryMappings;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView, countryMappings, onLoginClick }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });
  const [hoveredGeoRsmKey, setHoveredGeoRsmKey] = useState<string | null>(null);
  
  // State for AI Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<AiSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isOrgPanelOpen, setIsOrgPanelOpen] = useState(false);

  // Auth state
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);


  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => {
    const { zoom } = pos;
    let [lon, lat] = pos.coordinates;

    const maxLonDeviation = 180 * (1 - 1 / zoom);
    lon = Math.max(-maxLonDeviation, Math.min(lon, maxLonDeviation));
    
    const maxLatDeviation = 85 * (1 - 1 / zoom);
    lat = Math.max(20 - maxLatDeviation, Math.min(lat, 20 + maxLatDeviation));

    setPosition({ coordinates: [lon, lat], zoom });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);

  const stars = useMemo(() => {
    const numStars = 250;
    return Array.from({ length: numStars }).map((_, i) => ({
      key: `star-${i}`,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 1.5 + 0.5}px`,
        height: `${Math.random() * 1.5 + 0.5}px`,
        opacity: Math.random() * 0.5 + 0.2,
      },
    }));
  }, []);

  const getCountryName = (geo: any): string | undefined => {
    return geo.properties.name || geo.properties.NAME || geo.properties.NAME_LONG;
  };

  const handleCountryClick = (geo: any) => {
    const geoName = getCountryName(geo);
    if (!geoName) return;

    const normalizedGeoName = geoName.trim().toLowerCase();
    const turkishName = countryMappings.geoJsonNameToTurkish.get(normalizedGeoName);
    
    if (turkishName && countryMappings.allCountries.some(c => c.name === turkishName)) {
      setView({ name: 'country', context: { countryName: turkishName } });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearchModalOpen(true);
    setIsSearching(true);
    setSearchResult(null);
    setSearchError(null);
    
    try {
        const result = await performAiSearch(searchQuery);
        setSearchResult(result);
    } catch (error) {
        setSearchError(error instanceof Error ? error.message : 'An error occurred during the search.');
    } finally {
        setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isSearching) {
          handleSearch();
      }
  };

  const closeSearchModal = () => {
      setIsSearchModalOpen(false);
      setSearchResult(null);
      setSearchError(null);
  }

  const AuthControls = () => {
    if (isAuthenticated && currentUser) {
      return (
        <div className="relative" ref={profileMenuRef}>
          <button
            id="user-menu-button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
            aria-label="User menu"
            className="h-10 flex items-center gap-2 px-3 rounded-lg bg-slate-100/80 dark:bg-analyst-input/80 hover:bg-slate-200 dark:hover:bg-analyst-item-hover transition-colors"
          >
            <UserCircleIcon className="w-6 h-6 text-slate-600 dark:text-analyst-text-secondary" />
            <span className="text-sm font-medium text-slate-800 dark:text-analyst-text-primary truncate max-w-[100px]">{currentUser.name}</span>
            <ChevronDownIcon className={`w-4 h-4 text-slate-500 dark:text-analyst-text-secondary transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isProfileMenuOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-56 bg-white/80 dark:bg-analyst-sidebar/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-analyst-border/80 z-50"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              <div className="p-3 border-b border-slate-200 dark:border-analyst-border/50">
                <p className="text-sm font-semibold text-slate-800 dark:text-analyst-text-primary truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 dark:text-analyst-text-secondary truncate">{currentUser.email}</p>
              </div>
              <div className="p-2" role="none">
                 <button
                  onClick={() => { setView({ name: 'portal' }); setIsProfileMenuOpen(false); }}
                  role="menuitem"
                  aria-label="Go to dashboard"
                  className="w-full h-11 flex items-center gap-3 text-left px-3 rounded-lg text-sm text-slate-800 dark:text-analyst-text-primary hover:bg-slate-100 dark:hover:bg-analyst-item-hover transition-colors group"
                >
                  <GridIcon className="h-5 w-5 text-slate-500 dark:text-analyst-text-secondary transition-all duration-200 group-hover:text-analyst-accent group-hover:scale-105" />
                  <span className="font-medium">Dashboard</span>
                </button>
                <div className="my-1 border-t border-slate-200 dark:border-analyst-border/50"></div>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  role="menuitem"
                  aria-label="Logout"
                  className="w-full h-11 flex items-center gap-3 text-left px-3 rounded-lg text-sm text-red-600 dark:text-red-500 hover:bg-red-500/10 transition-colors group"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 transition-all duration-200 group-hover:scale-105" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <button 
        onClick={onLoginClick} 
        className="h-10 px-4 flex items-center rounded-lg bg-slate-100 dark:bg-analyst-input border border-slate-300 dark:border-analyst-border text-slate-800 dark:text-analyst-text-primary text-sm font-medium transition-all duration-200 hover:scale-[1.05] hover:shadow-md"
      >
        Login / Register
      </button>
    );
  };

  return (
    // Update the main container div
    <div className="min-h-screen w-full overflow-x-hidden font-sans relative text-slate-100 dark:text-slate-300 flex flex-col">
    
    // Update the map component
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: isMobile() ? 40 : isTablet() ? 60 : 80
      }}
      className="w-full h-full"
      style={{
        width: "100%",
        height: "100%",
        maxHeight: isMobile() ? "calc(100vh - 180px)" : "calc(100vh - 120px)",
        maxWidth: "100vw",
        overflow: "visible"
      }}
    >
    
    // Update the header for mobile
    <header className="sticky top-0 z-30 h-auto py-2 md:h-16 bg-white/80 dark:bg-analyst-dark-bg/80 backdrop-blur-lg border-b border-slate-300/20 dark:border-analyst-border/50 safe-area-top">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between h-full gap-2">
        {/* Mobile-optimized header layout */}
      </div>
    </header>
       <OrganizationsPanel
        isOpen={isOrgPanelOpen}
        onClose={() => setIsOrgPanelOpen(false)}
        countryMappings={countryMappings}
        onSelectCountry={(countryName) => {
          setIsOrgPanelOpen(false);
          setView({ name: 'country', context: { countryName } });
        }}
      />
      <style>{`
        /* Style block for any future custom CSS */
      `}</style>

      {/* Background container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Light Mode Background */}
        <div className="absolute inset-0 bg-black dark:hidden" />
        <div className="dark:hidden">
            <RotatingMoon />
        </div>


        {/* Dark Mode Background */}
        <div className="absolute inset-0 hidden dark:block bg-black" />
        <div className="hidden dark:block">
            <RotatingGlobe />
        </div>

        {/* Common Elements (Stars) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-70">
            {stars.map(star => <Star key={star.key} style={star.style} />)}
        </div>
      </div>


      {/* Content container - update to be responsive */}
      <div className="relative z-10 flex flex-col h-full w-full bg-transparent max-w-full">
        <header className="sticky top-0 z-30 h-16 pt-safe-top bg-white/80 dark:bg-analyst-dark-bg/80 backdrop-blur-lg border-b border-slate-300/20 dark:border-analyst-border/50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
            {/* Left Section */}
            <div className="flex items-center gap-3">
                <GlobeAltIcon className="h-7 w-7 text-slate-800 dark:text-analyst-text-primary" />
                <span className="text-xl font-medium text-slate-900 dark:text-analyst-text-primary">
                    GovNews Global
                </span>
            </div>

            {/* Center Section */}
            <div className="flex-grow flex justify-center px-4 md:px-8 max-w-xl mx-auto w-full">
                <div className="relative w-full group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400 dark:text-analyst-text-secondary" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search government news globally…"
                        className="w-full h-10 bg-white/60 dark:bg-analyst-input/60 border border-slate-300/50 dark:border-analyst-border/50 rounded-full pl-11 pr-4 text-slate-900 dark:text-analyst-text-primary placeholder:text-analyst-text-secondary focus:outline-none focus:ring-2 focus:ring-analyst-accent/60 focus:border-transparent transition-shadow duration-300 shadow-md dark:shadow-black/20 hover:shadow-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        disabled={isSearching}
                    />
                </div>
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden md:flex items-center gap-4">
                 <button 
                    onClick={() => setIsOrgPanelOpen(true)}
                    className="h-10 px-4 flex items-center gap-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-[1.05] hover:shadow-lg bg-analyst-green"
                    title={t('Organizations')}
                >
                    <BuildingLibraryIcon className="h-5 w-5" />
                    <span className="hidden lg:inline">{t('Organizations')}</span>
                </button>
                <button 
                    onClick={() => setView({ name: 'compare' })}
                    className="h-10 px-4 flex items-center gap-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-[1.05] hover:shadow-lg bg-analyst-orange"
                    title={t('Compare')}
                >
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                    <span className="hidden lg:inline">{t('Compare')}</span>
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-10 px-4 flex items-center gap-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-[1.05] hover:shadow-lg bg-analyst-accent"
                    title={t('Search Countries')}
                >
                    <SearchIcon className="h-5 w-5" />
                    <span className="hidden md:inline">{t('Search Countries')}</span>
                </button>
                <AuthControls />
                <LanguageSelector />
                <ThemeToggleButton />
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggleButton />
              <LanguageSelector />
              <AuthControls />
              <MobileNavigation 
                onSearchClick={handleSearch}
                onCompareClick={() => setView({ name: 'compare' })}
                onOrganizationsClick={() => setIsOrgPanelOpen(true)}
                onCountrySearchClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        </header>
        
        <main className="flex-grow relative overflow-hidden flex items-center justify-center">
          <Tooltip id="map-tooltip" className="!bg-white dark:!bg-analyst-sidebar !text-slate-800 dark:!text-analyst-text-primary rounded-md shadow-lg !border !border-slate-200 dark:!border-analyst-border z-20" />
          <ComposableMap
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: window.innerWidth < 768 ? 50 : window.innerWidth < 1024 ? 65 : 80
            }}
            className="w-full h-full"
            style={{
                width: "100%",
                height: "100%",
                maxHeight: "calc(100vh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
                maxWidth: "100vw",
                overflow: "visible"
            }}
          >
            <defs>
                <filter id="refraction-effect">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="3" seed="5" result="noise">
                        <animate
                            attributeName="seed"
                            from="5"
                            to="125"
                            dur="8s"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                </filter>
            </defs>
            <ZoomableGroup
              center={position.coordinates}
              zoom={position.zoom}
              minZoom={1}
              onMoveEnd={handleMoveEnd}
              // @ts-ignore - motionConfig is a valid prop but may be missing from older or incorrect type definitions.
              motionConfig={{
                mass: 1,
                tension: 150,
                friction: 18,
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const geoName = getCountryName(geo);
                    const normalizedGeoName = (geoName || '').trim().toLowerCase();
                    const turkishName = countryMappings.geoJsonNameToTurkish.get(normalizedGeoName);
                    const isSelectable = !!turkishName && countryMappings.allCountries.some(c => c.name === turkishName);
                    const englishName = isSelectable ? countryMappings.turkishToEnglish.get(turkishName) : geoName;
                    const isHovered = hoveredGeoRsmKey === geo.rsmKey;

                    return (
                       <g
                          key={geo.rsmKey}
                          onMouseEnter={() => {
                            if (isSelectable) setHoveredGeoRsmKey(geo.rsmKey);
                          }}
                          onMouseLeave={() => {
                            if (isSelectable) setHoveredGeoRsmKey(null);
                          }}
                          onClick={() => handleCountryClick(geo)}
                          data-tooltip-id="map-tooltip"
                          data-tooltip-content={englishName}
                          style={{ cursor: isSelectable ? 'pointer' : 'default' }}
                        >
                          {/* Fill Layer */}
                          <Geography
                            geography={geo}
                            style={{
                              default: {
                                fill: isHovered
                                  ? (isSelectable ? 'rgba(10, 132, 255, 0.6)' : 'rgba(71, 85, 105, 0.7)')
                                  : 'rgba(148, 163, 184, 0.1)',
                                filter: isHovered ? 'none' : 'url(#refraction-effect)',
                                stroke: 'none',
                                outline: 'none',
                                transition: 'fill 0.2s ease-in-out',
                              }
                            }}
                          />
                          {/* Stroke Layer */}
                          <Geography
                            geography={geo}
                            style={{
                              default: {
                                fill: 'none',
                                stroke: isHovered
                                  ? (isSelectable ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)')
                                  : 'rgba(255, 255, 255, 0.5)',
                                strokeWidth: isHovered ? 1.5 : 1.0,
                                outline: 'none',
                                pointerEvents: 'none',
                                transition: 'stroke 0.2s ease-in-out, stroke-width 0.2s ease-in-out',
                              }
                            }}
                          />
                        </g>
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </main>

        <footer className="w-full text-center py-4 border-t border-slate-700/50 dark:border-analyst-border/50 bg-slate-900/50 dark:bg-black/20 backdrop-blur-sm flex-shrink-0 flex justify-center items-center gap-6">
          <p className="text-slate-400 text-xs tracking-wider uppercase">GovNews Global</p>
          {isAuthenticated && (
            <>
              <span className="text-slate-700 dark:text-slate-700">•</span>
              <button onClick={() => setView({ name: 'admin' })} className="text-slate-400 text-xs tracking-wider uppercase hover:text-slate-200 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5">
                 <ShieldCheckIcon className="h-3 w-3" />
                 {t('Admin Panel')}
              </button>
            </>
          )}
        </footer>
      </div>

       <AISearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        isLoading={isSearching}
        result={searchResult}
        error={searchError}
      />
      <CountrySelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCountry={(country) => {
            setIsModalOpen(false);
            setView({ name: 'country', context: { countryName: country } });
        }}
        countries={countryMappings.allCountries}
        countryMappings={countryMappings}
      />
    </div>
  );
};

export default LandingPage;
