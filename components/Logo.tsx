import React from 'react';

// Animated logo image provided by the user.
const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Logo_for_.gov_TLD.svg/1024px-Logo_for_.gov_TLD.svg.png';

export const AppLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <img src={logoUrl} alt="TheGovNews Logo" className={className} />
);