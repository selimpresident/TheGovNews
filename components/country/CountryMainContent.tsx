/**
 * Country Main Content Component
 * Manages the main content area of the country detail page
 */

import React, { memo } from 'react';
import Timeline from '../Timeline';
import CountryWelcomeDisplay from '../CountryWelcomeDisplay';
import ArticleList from '../ArticleList';
import DataSourceManager from './DataSourceManager';
import { Article } from '../../types';
import { AppDataState } from '../../hooks/useDataSourceReducer';

type ActiveSelection = 'all' | 'bookmarks' | 'conflicts' | 'gdelt' | 'nationalPress' | 'factbook' | 'worldBank' | 'oecd' | 'noaa' | 'reliefWeb' | 'populationPyramid' | 'osm' | 'socialMedia' | string | null;
type Category = 'official' | 'intelligence' | 'data';

interface CountryMainContentProps {
  activeSelection: ActiveSelection;
  activeCategory: Category;
  isEmbedded: boolean;
  englishCountryName: string;
  countryName: string;
  countryMappings: any;
  state: AppDataState;
  filteredArticles: Article[];
  countryArticles: Article[];
  onArticleSelect: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  onResetSource: (source: any) => void;
}

const CountryMainContent: React.FC<CountryMainContentProps> = memo(({
  activeSelection,
  activeCategory,
  isEmbedded,
  englishCountryName,
  countryName,
  countryMappings,
  state,
  filteredArticles,
  countryArticles,
  onArticleSelect,
  onToggleBookmark,
  onResetSource
}) => {
  const renderMainContent = () => {
    if (activeSelection === null) {
      const coordinates = countryMappings.turkishToLatLng.get(countryName);
      const countryGeography = state.worldAtlas.data?.objects.countries.geometries.find((g: any) => {
        const geoName = (g.properties.name || g.properties.NAME || g.properties.NAME_LONG);
        if (!geoName) return false;
        
        const normalizedGeoName = geoName.trim().toLowerCase();
        return countryMappings.geoJsonNameToTurkish.get(normalizedGeoName) === countryName;
      });

      return (
        <CountryWelcomeDisplay
          countryName={englishCountryName}
          geography={countryGeography}
          worldAtlas={state.worldAtlas.data}
          coordinates={coordinates}
          countryMappings={countryMappings}
        />
      );
    }

    // Handle data source panels
    const dataSourceSelections = [
      'conflicts', 'gdelt', 'nationalPress', 'factbook', 'worldBank', 
      'oecd', 'noaa', 'reliefWeb', 'populationPyramid', 'osm', 'socialMedia'
    ];

    if (dataSourceSelections.includes(activeSelection as string)) {
      return (
        <DataSourceManager
          activeSelection={activeSelection as any}
          state={state}
          englishCountryName={englishCountryName}
          countryName={countryName}
          countryMappings={countryMappings}
          onResetSource={onResetSource}
        />
      );
    }

    // Default to article list for other selections
    return (
      <ArticleList 
        articles={filteredArticles} 
        onArticleSelect={onArticleSelect} 
        onToggleBookmark={onToggleBookmark} 
      />
    );
  };

  return (
    <main className="flex-1 bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg shadow-lg overflow-hidden flex flex-col">
      {!isEmbedded && activeCategory === 'official' && (
        <div className="flex-shrink-0">
          <Timeline 
            articles={countryArticles} 
            onArticleSelect={onArticleSelect} 
          />
        </div>
      )}
      <div key={activeSelection} className="animate-content-fade-in flex-1 overflow-hidden">
        {renderMainContent()}
      </div>
    </main>
  );
});

CountryMainContent.displayName = 'CountryMainContent';

export default CountryMainContent;