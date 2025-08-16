import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { getOptimalScale } from '../utils/ui';
import { CountryMappings } from '../services/countryDataService';
import { fetchConflictEvents } from '../services/ucdp';
import type { ConflictPoint } from '../types';
import { Tooltip } from 'react-tooltip';
import { FireIcon, ChartBarIcon, BellIcon } from './Icons';
import { Spinner } from './Spinner';

interface CountryWelcomeDisplayProps {
  countryName: string;
  geography: any | undefined;
  worldAtlas: any | undefined;
  coordinates: [number, number] | undefined; // [lat, lon]
  countryMappings: CountryMappings;
}

type Layer = 'conflicts' | 'economy' | 'disasters';

const CountryWelcomeDisplay: React.FC<CountryWelcomeDisplayProps> = ({ countryName, geography, worldAtlas, coordinates, countryMappings }) => {
    const [activeLayers, setActiveLayers] = useState<Set<Layer>>(new Set());
    const [conflictData, setConflictData] = useState<ConflictPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const legislativeInfo = countryMappings.turkishToLegislativeInfo.get(countryName);
    const englishCountryName = countryMappings.turkishToEnglish.get(countryName) || countryName;


    useEffect(() => {
        const ucdpName = countryMappings.turkishToUcdpName.get(countryName);
        if (ucdpName && activeLayers.has('conflicts')) {
            setIsLoading(true);
            fetchConflictEvents(ucdpName)
                .then(data => setConflictData(data.slice(0, 20))) // Limit to 20 most recent
                .finally(() => setIsLoading(false));
        } else {
            setConflictData([]);
        }
    }, [activeLayers, countryName, countryMappings]);

    const toggleLayer = (layer: Layer) => {
        setActiveLayers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(layer)) {
                newSet.delete(layer);
            } else {
                newSet.add(layer);
            }
            return newSet;
        });
    };
    
    const greeting = useMemo(() => {
        if (!legislativeInfo?.greetings) {
            return `Welcome to ${englishCountryName}`;
        }
        return legislativeInfo.greetings['en'] 
            || `Welcome to ${englishCountryName}`;
    }, [legislativeInfo, englishCountryName]);

    // Mock data for non-conflict layers
    const mockEconomicHotspots = useMemo(() => {
        if (!coordinates) return [];
        return Array.from({ length: 5 }, (_, i) => ({
            id: `eco-${i}`,
            name: `Economic Hub #${i + 1}`,
            coordinates: [coordinates[1] + (Math.random() - 0.5) * 4, coordinates[0] + (Math.random() - 0.5) * 4] as [number, number],
        }));
    }, [coordinates]);
     const mockDisasterAlerts = useMemo(() => {
        if (!coordinates) return [];
        return Array.from({ length: 3 }, (_, i) => ({
            id: `dis-${i}`,
            name: `Disaster Alert #${i + 1}`,
            coordinates: [coordinates[1] + (Math.random() - 0.5) * 5, coordinates[0] + (Math.random() - 0.5) * 5] as [number, number],
        }));
    }, [coordinates]);


    if (!geography || !worldAtlas || !coordinates) {
        return <div className="h-full flex items-center justify-center"><p className="text-slate-500">Loading map...</p></div>;
    }
    const scale = getOptimalScale(geography) * 1.5;

    const layerConfig: Record<Layer, { name: string; icon: React.ReactNode; color: string; data: any[] }> = {
        conflicts: { name: 'Conflict Zones', icon: <FireIcon className="h-5 w-5"/>, color: 'text-red-500', data: conflictData },
        economy: { name: 'Economic Hotspots', icon: <ChartBarIcon className="h-5 w-5"/>, color: 'text-blue-500', data: mockEconomicHotspots },
        disasters: { name: 'Disaster Alerts', icon: <BellIcon className="h-5 w-5"/>, color: 'text-yellow-500', data: mockDisasterAlerts },
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 relative">
             <div className="absolute top-4 left-4 z-10 text-center">
                 <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-lg">{greeting}!</h1>
             </div>
            <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
                <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">Toggle Layers</h4>
                 <div className="space-y-2">
                    {Object.entries(layerConfig).map(([key, config]) => (
                        <label key={key} className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors ${activeLayers.has(key as Layer) ? 'bg-slate-200/50 dark:bg-slate-700/50' : ''}`}>
                            <input
                                type="checkbox"
                                checked={activeLayers.has(key as Layer)}
                                onChange={() => toggleLayer(key as Layer)}
                                className={`h-4 w-4 rounded border-slate-400 focus:ring-2 focus:ring-offset-0 ${config.color}`}
                                style={{ accentColor: 'currentColor' }}
                            />
                            <div className={`flex items-center gap-2 ${config.color}`}>
                                {config.icon}
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{config.name}</span>
                            </div>
                        </label>
                    ))}
                 </div>
                 {isLoading && <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center"><Spinner /></div>}
            </div>

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: scale,
                center: [coordinates[1], coordinates[0]], // center expects [lon, lat]
              }}
              style={{ width: "100%", height: "100%", maxHeight: '70vh' }}
            >
                <Geographies geography={worldAtlas}>
                    {({ geographies }) =>
                      geographies.map(geo => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={geo.properties.name === geography.properties.name ? "#94a3b8" : "#e2e8f0"}
                            stroke="#f8fafc"
                            className={`dark:stroke-slate-800 ${geo.properties.name === geography.properties.name ? 'dark:fill-slate-600' : 'dark:fill-slate-700'}`}
                        />
                      ))
                    }
                </Geographies>

                {activeLayers.has('conflicts') && conflictData.map(point => (
                     <Marker key={point.id} coordinates={point.coordinates}>
                        <circle r={4 + Math.log(point.fatalities + 1)} className="fill-red-500/50 stroke-red-700/80" data-tooltip-id="map-tooltip" data-tooltip-content={`${point.name}: ${point.fatalities} fatalities`} />
                    </Marker>
                ))}
                 {activeLayers.has('economy') && mockEconomicHotspots.map(point => (
                     <Marker key={point.id} coordinates={point.coordinates}>
                        <circle r={6} className="fill-blue-500/50 stroke-blue-700/80" data-tooltip-id="map-tooltip" data-tooltip-content={point.name} />
                    </Marker>
                ))}
                 {activeLayers.has('disasters') && mockDisasterAlerts.map(point => (
                     <Marker key={point.id} coordinates={point.coordinates}>
                        <circle r={7} className="fill-yellow-500/50 stroke-yellow-700/80" data-tooltip-id="map-tooltip" data-tooltip-content={point.name} />
                    </Marker>
                ))}
            </ComposableMap>
            <Tooltip id="map-tooltip" className="!bg-slate-900 !text-slate-200 rounded-md shadow-lg !border !border-slate-700 !text-sm z-20" />
        </div>
    );
};

export default CountryWelcomeDisplay;