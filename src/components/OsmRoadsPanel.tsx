import React, { useState, useMemo } from 'react';
import { RoadIcon } from './Icons';
import { OsmData, OsmRoad } from '../types';
import { ComposableMap, Geographies, Geography, Line, ZoomableGroup } from 'react-simple-maps';
import { Spinner } from './Spinner';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const highwayTypes = ['motorway', 'trunk', 'primary', 'secondary'] as const;
type HighwayType = typeof highwayTypes[number];

const highwayColors: Record<HighwayType, string> = {
    motorway: '#3b82f6', // blue-500
    trunk: '#16a34a', // green-600
    primary: '#ef4444', // red-500
    secondary: '#f97316', // orange-500
};

interface OsmRoadsPanelProps {
  data: OsmData | null;
  countryName: string;
  center: [number, number]; // lat, lon
  isLoading: boolean;
}

const OsmRoadsPanel: React.FC<OsmRoadsPanelProps> = ({ data, countryName, center, isLoading }) => {
    const [visibleTypes, setVisibleTypes] = useState<HighwayType[]>(['motorway', 'trunk', 'primary', 'secondary']);
    
    const toggleTypeVisibility = (type: HighwayType) => {
        setVisibleTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const filteredRoads = useMemo(() => {
        if (!data?.data) return [];
        return data.data.filter(road => visibleTypes.includes(road.highway as HighwayType));
    }, [data, visibleTypes]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-[60vh]">
                <Spinner />
                <p className="mt-4 text-slate-500 dark:text-analyst-text-secondary">Loading road network data...</p>
            </div>
        );
    }
    
    const hasData = data && data.data && data.data.length > 0;
    
    if (!hasData) {
        return (
            <div className="text-center p-16">
                <RoadIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-analyst-text-secondary"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">No Road Data Available</h3>
                <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary max-w-md mx-auto">{`Could not retrieve road network data for ${countryName}. The query might have been too complex or the region may have limited data.`}</p>
                {data?.message && <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {data.message}</p>}
            </div>
        );
    }
    
    return (
        <div>
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-analyst-border">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-analyst-text-primary">Road Network</h2>
                <p className="text-slate-500 dark:text-analyst-text-secondary mt-1">{`Major road networks in ${countryName} from OpenStreetMap.`}</p>
            </div>
            
            <div className="relative">
                <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-analyst-sidebar/80 backdrop-blur-md p-3 rounded-lg border border-slate-200 dark:border-analyst-border shadow-lg">
                    <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-analyst-text-primary">Highway Types</h4>
                    <div className="space-y-2">
                        {highwayTypes.map(type => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                    type="checkbox"
                                    checked={visibleTypes.includes(type)}
                                    onChange={() => toggleTypeVisibility(type)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    style={{ accentColor: highwayColors[type] }}
                                />
                                <span style={{ color: highwayColors[type] }} className="font-medium capitalize">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="w-full h-[65vh] bg-slate-100 dark:bg-analyst-dark-bg">
                    <ComposableMap projectionConfig={{ scale: 600 }}>
                        <ZoomableGroup center={[center[1], center[0]]} zoom={5}>
                             <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map(geo => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="#e2e8f0" // slate-200
                                            stroke="#f8fafc" // slate-50
                                            className="dark:fill-analyst-sidebar dark:stroke-analyst-dark-bg"
                                        />
                                    ))
                                }
                            </Geographies>
                            {filteredRoads.map(road => (
                                <Line
                                    key={road.id}
                                    coordinates={road.geometry.map(p => [p.lon, p.lat])}
                                    stroke={highwayColors[road.highway as HighwayType] || '#64748b'}
                                    strokeWidth={road.highway === 'motorway' ? 1.2 : road.highway === 'trunk' ? 1 : 0.8}
                                    strokeLinecap="round"
                                />
                            ))}
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            </div>
        </div>
    );
};

export default OsmRoadsPanel;