import React from 'react';

// Animated logo image provided by the user.
const logoUrl = 'https://cdn.mos.cms.futurecdn.net/Wi95cH3JMmPJtR4rUe4yWX.gif';

export const AppLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <img src={logoUrl} alt="TheGovNews Logo" className={className} />
);