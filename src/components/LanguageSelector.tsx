import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { GlobeAltIcon, ChevronDownIcon } from './Icons';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 h-10 rounded-lg bg-slate-100/50 dark:bg-analyst-input/50 hover:bg-slate-200/70 dark:hover:bg-analyst-item-hover transition-colors"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-analyst-text-primary">{currentLanguage.name}</span>
        <ChevronDownIcon className="h-4 w-4 text-slate-500 dark:text-analyst-text-secondary" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-analyst-sidebar rounded-lg shadow-lg border border-slate-200 dark:border-analyst-border z-50">
          <ul className="p-1">
            {languages.map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-analyst-item-hover text-slate-700 dark:text-analyst-text-primary"
                >
                   <span className="text-lg">{lang.flag}</span>
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
