import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { getOptimalScale } from '../utils/ui';

interface AnimatedFlagBackgroundProps {
  flagUrl: string | undefined;
  countryName: string;
  geography: any | undefined;
  worldAtlas: any | undefined;
  coordinates: [number, number] | undefined; // [lat, lon]
}

const AnimatedFlagBackground: React.FC<AnimatedFlagBackgroundProps> = ({ flagUrl, countryName, geography, worldAtlas, coordinates }) => {
  if (!flagUrl) {
    return (
      <div className="fixed inset-0 -z-10 bg-slate-200 dark:bg-slate-900 transition-colors duration-500" />
    );
  }
  
  const scale = getOptimalScale(geography);

  return (
    <>
      <style>{`
        @keyframes draw-and-fade {
          0% {
            stroke-dashoffset: 5000;
            opacity: 0;
          }
          20% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          80% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -5000;
            opacity: 0;
          }
        }
        .country-border-path {
          stroke-dasharray: 5000;
          stroke-dashoffset: 5000;
          animation: draw-and-fade 12s ease-in-out infinite;
          filter: url(#glow);
        }
      `}</style>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-900">
        {/* Layer 1: Animated Flag */}
        <img
          key={flagUrl}
          src={flagUrl}
          alt={`Flag of ${countryName}`}
          className="absolute inset-0 w-full h-full object-cover animate-kenburns"
        />

        {/* Layer 2: Light/Dark Overlay */}
        <div className="absolute inset-0 bg-white/70 dark:bg-black/90 backdrop-blur-md z-10"></div>

        {/* Layer 3: Animated Country Border (on top of overlay) */}
        {worldAtlas && geography && coordinates && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: scale,
                center: [coordinates[1], coordinates[0]], // center expects [lon, lat]
              }}
              width={800}
              height={600}
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <Geographies geography={worldAtlas}>
                {({ geographies }) =>
                  geographies
                    .filter(geo => geo.properties.name === geography.properties.name)
                    .map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="none"
                        stroke="#FFD700" // Golden yellow color
                        strokeWidth={3}
                        className="country-border-path"
                      />
                    ))
                }
              </Geographies>
            </ComposableMap>
          </div>
        )}
      </div>
    </>
  );
};

export default AnimatedFlagBackground;