/**
 * Country Background Component
 * Manages the animated flag background for country pages
 */

import React, { memo } from 'react';
import AnimatedFlagBackground from '../AnimatedFlagBackground';

interface CountryBackgroundProps {
  isEmbedded: boolean;
  flagUrl?: string;
  countryName: string;
  geography: any;
  worldAtlas: any;
  coordinates?: [number, number];
}

const CountryBackground: React.FC<CountryBackgroundProps> = memo(({
  isEmbedded,
  flagUrl,
  countryName,
  geography,
  worldAtlas,
  coordinates
}) => {
  if (isEmbedded) {
    return null;
  }

  return (
    <AnimatedFlagBackground 
      flagUrl={flagUrl} 
      countryName={countryName} 
      geography={geography}
      worldAtlas={worldAtlas}
      coordinates={coordinates}
    />
  );
});

CountryBackground.displayName = 'CountryBackground';

export default CountryBackground;