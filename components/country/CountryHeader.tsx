/**
 * Country Header Component
 * Displays country-specific header information and navigation
 */

import React, { memo } from 'react';
import Header from '../Header';
import MiniDashboard from '../MiniDashboard';
import { DashboardData } from '../../hooks/useDataSourceReducer';

type Category = 'official' | 'intelligence' | 'data';

interface CountryHeaderProps {
  isEmbedded: boolean;
  activeCategory: Category;
  dashboardData: DashboardData;
  onNavigateBack: () => void;
  onSetCategory: (category: Category) => void;
}

const CountryHeader: React.FC<CountryHeaderProps> = memo(({
  isEmbedded,
  activeCategory,
  dashboardData,
  onNavigateBack,
  onSetCategory
}) => {
  if (isEmbedded) {
    return null;
  }

  return (
    <>
      <Header 
        onNavigateBack={onNavigateBack} 
        activeCategory={activeCategory} 
        onSetCategory={onSetCategory} 
      />
      <div className="flex-shrink-0 px-2 sm:px-3 py-2">
        <MiniDashboard 
          population={dashboardData.population}
          gdp={dashboardData.gdp}
          latestEventDate={dashboardData.latestEventDate}
        />
      </div>
    </>
  );
});

CountryHeader.displayName = 'CountryHeader';

export default CountryHeader;