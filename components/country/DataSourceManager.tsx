/**
 * Data Source Manager Component
 * Manages data loading and rendering for different data sources in CountryDetailPage
 */

import React, { memo, useCallback } from 'react';
import { Spinner } from '../Spinner';
import ConflictInfoPanel from '../panels/ConflictInfoPanel';
import GdeltInfoPanel from '../panels/GdeltInfoPanel';
import NationalPressPanel from '../panels/NationalPressPanel';
import FactbookPanel from '../panels/FactbookPanel';
import WorldBankPanel from '../panels/WorldBankPanel';
import OecdPanel from '../components/OecdPanel';
import NoaaPanel from '../components/NoaaPanel';
import ReliefWebPanel from '../components/ReliefWebPanel';
import PopulationPyramidPanel from '../components/PopulationPyramidPanel';
import OsmRoadsPanel from '../components/OsmRoadsPanel';
import SocialMediaPanel from '../components/SocialMediaPanel';
import { DataSourceKey, AppDataState } from '../../hooks/useDataSourceReducer';

type ActiveSelection = 'conflicts' | 'gdelt' | 'nationalPress' | 'factbook' | 'worldBank' | 'oecd' | 'noaa' | 'reliefWeb' | 'populationPyramid' | 'osm' | 'socialMedia';

interface DataSourceManagerProps {
  activeSelection: ActiveSelection;
  state: AppDataState;
  englishCountryName: string;
  countryName: string;
  countryMappings: any;
  onResetSource: (source: DataSourceKey) => void;
}

interface DataPanelRendererProps {
  source: DataSourceKey;
  state: AppDataState;
  englishCountryName: string;
  PanelComponent: React.ComponentType<any>;
  panelProps?: Record<string, any>;
  onResetSource: (source: DataSourceKey) => void;
}

const DataPanelRenderer: React.FC<DataPanelRendererProps> = memo(({
  source,
  state,
  englishCountryName,
  PanelComponent,
  panelProps = {},
  onResetSource
}) => {
  const sourceState = state[source];
  
  if (sourceState.loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[40vh]">
        <Spinner />
      </div>
    );
  }
  
  if (sourceState.error) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[40vh] text-center p-8">
        <p className="text-red-600 dark:text-red-400 mb-2">Veri yüklenirken hata oluştu</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{sourceState.error}</p>
        <button 
          onClick={() => onResetSource(source)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }
  
  if (sourceState.data) {
    return (
      <PanelComponent 
        data={sourceState.data} 
        countryName={englishCountryName} 
        {...panelProps} 
      />
    );
  }
  
  return null;
});

DataPanelRenderer.displayName = 'DataPanelRenderer';

const DataSourceManager: React.FC<DataSourceManagerProps> = memo(({
  activeSelection,
  state,
  englishCountryName,
  countryName,
  countryMappings,
  onResetSource
}) => {
  const handleResetSource = useCallback((source: DataSourceKey) => {
    onResetSource(source);
  }, [onResetSource]);

  switch (activeSelection) {
    case 'conflicts':
      return (
        <DataPanelRenderer
          source="conflicts"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={ConflictInfoPanel}
          panelProps={{ events: state.conflicts.data }}
          onResetSource={handleResetSource}
        />
      );
      
    case 'gdelt':
      return (
        <div className="h-full flex flex-col">
          <div className="p-6 md:p-8 border-b border-slate-200/70 dark:border-slate-700/50 flex-shrink-0">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Global Media Watch</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {`Recent articles from global media sources mentioning ${englishCountryName}`}
            </p>
          </div>
          {state.gdelt.loading ? (
            <div className="flex-grow flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <GdeltInfoPanel 
              articles={state.gdelt.data || []} 
              countryName={englishCountryName} 
              error={state.gdelt.error} 
            />
          )}
        </div>
      );
      
    case 'nationalPress':
      return (
        <DataPanelRenderer
          source="nationalPress"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={NationalPressPanel}
          panelProps={{ articles: state.nationalPress.data }}
          onResetSource={handleResetSource}
        />
      );
      
    case 'factbook':
      return (
        <DataPanelRenderer
          source="factbook"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={FactbookPanel}
          onResetSource={handleResetSource}
        />
      );
      
    case 'worldBank':
      return (
        <DataPanelRenderer
          source="worldBank"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={WorldBankPanel}
          onResetSource={handleResetSource}
        />
      );
      
    case 'oecd':
      return (
        <DataPanelRenderer
          source="oecd"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={OecdPanel}
          onResetSource={handleResetSource}
        />
      );
      
    case 'noaa':
      return (
        <DataPanelRenderer
          source="noaa"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={NoaaPanel}
          onResetSource={handleResetSource}
        />
      );
      
    case 'reliefWeb':
      return (
        <DataPanelRenderer
          source="reliefWeb"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={ReliefWebPanel}
          panelProps={{ updates: state.reliefWeb.data }}
          onResetSource={handleResetSource}
        />
      );
      
    case 'populationPyramid':
      return (
        <DataPanelRenderer
          source="populationPyramid"
          state={state}
          englishCountryName={englishCountryName}
          PanelComponent={PopulationPyramidPanel}
          onResetSource={handleResetSource}
        />
      );
      
    case 'osm':
      const latLng = countryMappings.turkishToLatLng.get(countryName);
      if (!latLng) {
        return (
          <div className="text-center p-16">
            <p className="text-slate-500 dark:text-slate-400">
              {`Map coordinates not available for ${englishCountryName}.`}
            </p>
          </div>
        );
      }
      return (
        <OsmRoadsPanel 
          data={state.osm.data} 
          countryName={englishCountryName} 
          center={latLng} 
          isLoading={state.osm.loading} 
        />
      );
      
    case 'socialMedia':
      if (state.socialMedia.status === 'loading') {
        return (
          <div className="flex flex-col justify-center items-center h-full min-h-[60vh]">
            <Spinner />
            <p className="mt-4 text-slate-500 dark:text-slate-400">Fetching social media posts...</p>
          </div>
        );
      }
      return (
        <SocialMediaPanel 
          status={state.socialMedia.status} 
          posts={state.socialMedia.posts} 
          links={state.socialMedia.links}
          countryName={englishCountryName} 
        />
      );
      
    default:
      return null;
  }
});

DataSourceManager.displayName = 'DataSourceManager';

export default DataSourceManager;