
import React from 'react';
import { CountryMappings } from '../services/countryDataService';

interface ChatMessageRendererProps {
  text: string;
  countryMappings: CountryMappings;
  onCountryClick: (countryName: string) => void;
}

const ChatMessageRenderer: React.FC<ChatMessageRendererProps> = ({ text, countryMappings, onCountryClick }) => {
  const allEnglishNames = Array.from(countryMappings.turkishToEnglish.values());
  const allTurkishNames = Array.from(countryMappings.turkishToEnglish.keys());

  const allCountryNames = [...new Set([...allEnglishNames, ...allTurkishNames])].filter(Boolean) as string[];

  const escapeRegExp = (string: string): string => {
    // $& means the whole matched string
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Create a regex that is case-insensitive and finds whole words
  if (allCountryNames.length === 0) {
    return <div className="text-sm whitespace-pre-wrap">{text}</div>;
  }
  const countryRegex = new RegExp(`\\b(${allCountryNames.map(escapeRegExp).join('|')})\\b`, 'gi');

  const parts = text.split(countryRegex);
  
  const englishToTurkish = new Map(
    Array.from(countryMappings.turkishToEnglish.entries())
      .filter(([, englishName]) => !!englishName)
      .map(([turkishName, englishName]) => [englishName.toLowerCase(), turkishName])
  );

  return (
    <div className="text-sm whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (index % 2 === 1 && part) { // This is a country name match
          const lowerPart = part.toLowerCase();
          const turkishName = allTurkishNames.find(tn => tn.toLowerCase() === lowerPart) 
            || englishToTurkish.get(lowerPart);
            
          if (turkishName) {
            return (
              <button
                key={index}
                onClick={() => onCountryClick(turkishName)}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-100/50 dark:bg-blue-900/50 px-1 py-0.5 rounded transition-colors"
              >
                {part}
              </button>
            );
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default ChatMessageRenderer;
