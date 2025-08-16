import React from 'react';
import { SearchIcon, BuildingLibraryIcon, ArrowsRightLeftIcon, UserCircleIcon } from './Icons';
import { useTranslation } from "react-i18next";

interface MobileNavigationProps {
  onSearchClick: () => void;
  onOrganizationsClick: () => void;
  onCompareClick: () => void;
  onProfileClick: () => void;
  activeTab?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onSearchClick,
  onOrganizationsClick,
  onCompareClick,
  onProfileClick,
  activeTab
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-analyst-sidebar/90 backdrop-blur-md border-t border-slate-200 dark:border-analyst-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        <button 
          onClick={onSearchClick}
          className={`flex flex-col items-center justify-center w-1/4 h-full min-h-[44px] min-w-[44px] ${activeTab === 'search' ? 'text-analyst-accent' : 'text-slate-600 dark:text-analyst-text-secondary'}`}
          aria-label={t('Search')}
        >
          <SearchIcon className="h-6 w-6" />
          <span className="text-xs mt-1">{t('Search')}</span>
        </button>
        
        <button 
          onClick={onOrganizationsClick}
          className={`flex flex-col items-center justify-center w-1/4 h-full min-h-[44px] min-w-[44px] ${activeTab === 'organizations' ? 'text-analyst-green' : 'text-slate-600 dark:text-analyst-text-secondary'}`}
          aria-label={t('Organizations')}
        >
          <BuildingLibraryIcon className="h-6 w-6" />
          <span className="text-xs mt-1">{t('Orgs')}</span>
        </button>
        
        <button 
          onClick={onCompareClick}
          className={`flex flex-col items-center justify-center w-1/4 h-full min-h-[44px] min-w-[44px] ${activeTab === 'compare' ? 'text-analyst-orange' : 'text-slate-600 dark:text-analyst-text-secondary'}`}
          aria-label={t('Compare')}
        >
          <ArrowsRightLeftIcon className="h-6 w-6" />
          <span className="text-xs mt-1">{t('Compare')}</span>
        </button>
        
        <button 
          onClick={onProfileClick}
          className={`flex flex-col items-center justify-center w-1/4 h-full min-h-[44px] min-w-[44px] ${activeTab === 'profile' ? 'text-analyst-accent' : 'text-slate-600 dark:text-analyst-text-secondary'}`}
          aria-label={t('Profile')}
        >
          <UserCircleIcon className="h-6 w-6" />
          <span className="text-xs mt-1">{t('Profile')}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;