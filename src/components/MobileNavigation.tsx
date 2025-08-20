import React from 'react';
import { SearchIcon, BuildingLibraryIcon, ArrowsRightLeftIcon, UserCircleIcon } from './Icons';
import { useTranslation } from "react-i18next";
import { useIsMobile, touchTargets } from '../utils/responsive';

interface MobileNavigationProps {
  onSearchClick: () => void;
  onOrganizationsClick: () => void;
  onCompareClick: () => void;
  onProfileClick: () => void;
  onCountrySearchClick?: () => void;
  activeTab?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onSearchClick,
  onOrganizationsClick,
  onCompareClick,
  onProfileClick,
  onCountrySearchClick,
  activeTab
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  // Enhanced navigation items with better responsive design
  const navItems = [
    {
      id: 'search',
      label: t('Ara'),
      icon: SearchIcon,
      onClick: onCountrySearchClick || onSearchClick,
      color: 'text-modern-primary'
    },
    {
      id: 'organizations',
      label: t('Kuruluşlar'),
      icon: BuildingLibraryIcon,
      onClick: onOrganizationsClick,
      color: 'text-modern-success'
    },
    {
      id: 'compare',
      label: t('Karşılaştır'),
      icon: ArrowsRightLeftIcon,
      onClick: onCompareClick,
      color: 'text-modern-warning'
    },
    {
      id: 'profile',
      label: t('Profil'),
      icon: UserCircleIcon,
      onClick: onProfileClick,
      color: 'text-modern-accent'
    }
  ];
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-modern-surface/95 backdrop-blur-xl border-t border-modern-border-light-theme/30 dark:border-modern-border/50 z-50 safe-area-bottom shadow-modern-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        minHeight: `${touchTargets.comfortable}px`
      }}
    >
      <div className="flex items-stretch justify-around" style={{ minHeight: `${touchTargets.large}px` }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`
                flex flex-col items-center justify-center flex-1 h-full px-2 py-2
                transition-all duration-300 ease-out
                hover:bg-modern-surface-light/50 dark:hover:bg-modern-surface/30
                active:scale-95 active:bg-modern-surface-light/70 dark:active:bg-modern-surface/50
                ${isActive 
                  ? `${item.color} font-semibold bg-modern-surface-light/30 dark:bg-modern-surface/20` 
                  : 'text-modern-text-secondary hover:text-modern-text-primary'
                }
              `}
              style={{
                minHeight: `${touchTargets.large}px`,
                minWidth: `${touchTargets.large}px`
              }}
              aria-label={item.label}
              role="tab"
              aria-selected={isActive}
            >
              <Icon 
                className={`
                  h-6 w-6 mb-1 transition-transform duration-200
                  ${isActive ? 'scale-110' : 'scale-100'}
                `} 
              />
              <span 
                className={`
                  text-xs font-medium transition-all duration-200
                  ${isMobile ? 'block' : 'hidden sm:block'}
                  ${isActive ? 'opacity-100' : 'opacity-80'}
                `}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-current rounded-full opacity-80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;