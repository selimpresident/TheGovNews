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
// Removed AI search imports
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Removed AI Search state variables
  const [isOrgPanelOpen, setIsOrgPanelOpen] = useState(false);

  // Auth state
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [mapScale, setMapScale] = useState(120);

  useEffect(() => {
    const handleResize = () => {
      setMapScale(Math.min(Math.max(window.innerWidth / 12, 60), 150));
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMoveStart = () => {
    // Optional: Add loading state or visual feedback
  };

  const handleMove = (pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  };

  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => {
    const { zoom } = pos;
    let [lon, lat] = pos.coordinates;

    const maxLonDeviation = 180 * (1 - 1 / zoom);
    lon = Math.max(-maxLonDeviation, Math.min(lon, maxLonDeviation));
    
    const maxLatDeviation = 85 * (1 - 1 / zoom);
    lat = Math.max(20 - maxLatDeviation, Math.min(lat, 20 + maxLatDeviation));

    setPosition({ coordinates: [lon, lat], zoom });
  };

  const filterZoomEvent = (e: any) => {
    // Add any custom zoom restrictions here
    return true;
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

  // Removed search handler functions

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
        className="h-10 px-4 flex items-center rounded-xl bg-gradient-to-r from-modern-primary to-modern-secondary text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-modern-glow shadow-modern animate-fade-in"
      >
        Login / Register
      </button>
    );
  };

  return (
    // Update the main container div
    <div className="min-h-screen w-full overflow-x-hidden font-sans relative text-modern-text-primary-light dark:text-modern-text-primary flex flex-col bg-gradient-to-br from-modern-light to-modern-surface-light dark:from-modern-dark dark:to-modern-darker transition-all duration-300">
    {/* Responsive map component */}
    <div className="relative w-full h-full">
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: Math.min(
            Math.max(
              window.innerWidth / 8,
              60
            ),
            180
          )
        }}
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100vh",
          minHeight: "100vh",
          overflow: "visible"
        }}
      >
    
    // Update the header for mobile
    <header className="sticky top-0 z-30 h-auto py-2 md:h-16 bg-modern-lighter/90 dark:bg-modern-surface/90 backdrop-blur-xl border-b border-modern-border-light-theme/30 dark:border-modern-border/50 safe-area-top shadow-modern transition-all duration-300">
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
        {/* Light Mode Background with moon */}
        <div className="absolute inset-0 bg-black dark:hidden" />
        <div className="dark:hidden relative w-full h-full">
            <RotatingMoon className="absolute inset-0 w-full h-full" />
        </div>

      {/* Dark Mode Background with globe and map container */}
      <div className="absolute inset-0 hidden dark:block bg-black">
        <div className="relative w-full h-full">
          <RotatingGlobe className="absolute inset-0 w-full h-full" />
          {/* Map container synchronized with globe */}
          <div className="absolute inset-0 w-full h-full" style={{
            touchAction: 'none',
            userSelect: 'none',
            position: 'relative',
            zIndex: 0
          }}>
          <ComposableMap
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: Math.min(
                Math.max(
                  window.innerWidth / (isMobile ? 8 : 10),
                  isMobile ? 60 : 80
                ),
                isMobile ? 150 : 200
              )
            }}
            className="w-full h-full"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            minHeight: isMobile ? '400px' : '500px'
          }}
            >
              {/* Keep existing map content */}
            </ComposableMap>
          </div>
        </div>
      </div>

      {/* Common Elements (Stars) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-70">
          {stars.map(star => <Star key={star.key} style={star.style} />)}
      </div>
    </div>

    {/* Main content container */}
    <div className="relative z-10 flex flex-col min-h-screen w-full bg-transparent">
      {/* Header and other content remains the same */}
        <header className="sticky top-0 z-30 h-16 pt-safe-top bg-white/80 dark:bg-analyst-dark-bg/80 backdrop-blur-lg border-b border-slate-300/20 dark:border-analyst-border/50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
            {/* Left Section */}
            <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-modern-primary to-modern-secondary shadow-modern-lg group-hover:shadow-modern-glow transition-all duration-300">
                    <GlobeAltIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-modern-primary to-modern-secondary bg-clip-text text-transparent">
                    GovNews Global
                </span>
            </div>

            {/* Center Section - Search bar removed */}
            <div className="flex-grow"></div>

            {/* Right Section - Desktop */}
            <div className="hidden md:flex items-center gap-3">
                 <button 
                    onClick={() => setIsOrgPanelOpen(true)}
                    className="h-10 px-4 flex items-center gap-2 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-modern-lg bg-gradient-to-r from-modern-success to-emerald-600 shadow-modern animate-fade-in"
                    title={t('Organizations')}
                >
                    <BuildingLibraryIcon className="h-4 w-4" />
                    <span className="hidden lg:inline">{t('Organizations')}</span>
                </button>
                <button 
                    onClick={() => setView({ name: 'compare' })}
                    className="h-10 px-4 flex items-center gap-2 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-modern-lg bg-gradient-to-r from-modern-warning to-orange-600 shadow-modern animate-fade-in"
                    title={t('Compare')}
                >
                    <ArrowsRightLeftIcon className="h-4 w-4" />
                    <span className="hidden lg:inline">{t('Compare')}</span>
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-10 px-4 flex items-center gap-2 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-modern-glow bg-gradient-to-r from-modern-primary to-modern-primary-dark shadow-modern animate-fade-in"
                    title={t('Search Countries')}
                >
                    <SearchIcon className="h-4 w-4" />
                    <span className="hidden md:inline">{t('Search Countries')}</span>
                </button>
                <AuthControls />
                <LanguageSelector />
                <ThemeToggleButton />
            </div>
            
            {/* Mobile Navigation - Updated */}
            <div className="md:hidden flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:block">
                <ThemeToggleButton />
              </div>
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
              <AuthControls />
              <MobileNavigation 
                onSearchClick={handleSearch}
                onCompareClick={() => setView({ name: 'compare' })}
                onOrganizationsClick={() => setIsOrgPanelOpen(true)}
                onCountrySearchClick={() => setIsModalOpen(true)}
                onProfileClick={() => setIsProfileMenuOpen(true)}
              />
            </div>
          </div>
        </header>
        
        <main className="relative w-full h-full">
          <Tooltip id="map-tooltip" className="!bg-white dark:!bg-analyst-sidebar !text-slate-800 dark:!text-analyst-text-primary rounded-md shadow-lg !border !border-slate-200 dark:!border-analyst-border z-20" />
          {/* ComposableMap moved inside the globe container */}
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
              minZoom={0.5}
              maxZoom={8}
              onMoveStart={handleMoveStart}
              onMove={handleMove}
              onMoveEnd={handleMoveEnd}
              filterZoomEvent={filterZoomEvent}
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

        <footer className="w-full text-center py-4 border-t border-modern-border-light-theme/30 dark:border-modern-border/50 bg-modern-lighter/80 dark:bg-modern-surface/80 backdrop-blur-xl flex-shrink-0 flex justify-center items-center gap-6 shadow-modern transition-all duration-300">
          <p className="text-modern-text-secondary-light dark:text-modern-text-secondary text-xs tracking-wider uppercase font-medium">GovNews Global</p>
          {isAuthenticated && (
            <>
              <span className="text-modern-border-light-theme dark:text-modern-border">•</span>
              <button onClick={() => setView({ name: 'admin' })} className="text-modern-text-secondary-light dark:text-modern-text-secondary text-xs tracking-wider uppercase hover:text-modern-primary dark:hover:text-modern-primary transition-all duration-300 flex items-center gap-1.5 hover:scale-105">
                 <ShieldCheckIcon className="h-3 w-3" />
                 {t('Admin Panel')}
              </button>
            </>
          )}
        </footer>
      </div>

       {/* AISearchModal removed */}
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
