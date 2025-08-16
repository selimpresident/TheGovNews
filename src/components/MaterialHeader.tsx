import React from 'react';
import { isAndroid } from '../utils/platformUtils';

interface MaterialHeaderProps {
  title: string;
  onBackClick?: () => void;
  actions?: React.ReactNode;
}

const MaterialHeader: React.FC<MaterialHeaderProps> = ({ title, onBackClick, actions }) => {
  // Only apply Material Design styles on Android
  if (!isAndroid()) {
    return null;
  }

  return (
    <header className="h-14 bg-analyst-accent text-white flex items-center px-4 shadow-md">
      {onBackClick && (
        <button 
          onClick={onBackClick}
          className="w-10 h-10 flex items-center justify-center rounded-full mr-4 hover:bg-white/10 active:bg-white/20"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <h1 className="text-lg font-medium flex-grow">{title}</h1>
      {actions}
    </header>
  );
};

export default MaterialHeader;