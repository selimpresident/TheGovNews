import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchIcon, CloseIcon } from './Icons';
import { CountryMappings } from '../services/countryDataService';

interface CountrySelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCountry: (country: string) => void;
    countries: { name: string; flag: string }[];
    countryMappings: CountryMappings;
}

const CountrySelectorModal: React.FC<CountrySelectorModalProps> = ({ isOpen, onClose, onSelectCountry, countries, countryMappings }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setSearchTerm('');
        }
    }, [isOpen]);

    const filteredCountries = useMemo(() => {
        const mappedCountries = countries.map(country => ({
            ...country,
            displayName: countryMappings.turkishToEnglish.get(country.name) || country.name
        }));

        if (!searchTerm) return mappedCountries;

        return mappedCountries.filter(country =>
            country.displayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                   .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        );
    }, [searchTerm, countries, countryMappings]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="country-selector-title"
        >
            <div 
                className="bg-white dark:bg-analyst-sidebar border border-slate-200 dark:border-analyst-border rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 dark:border-analyst-border flex items-center justify-between flex-shrink-0">
                    <h2 id="country-selector-title" className="text-xl font-bold text-slate-900 dark:text-analyst-text-primary">Search Countries</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-analyst-item-hover transition-colors" aria-label="Close">
                        <CloseIcon className="w-6 h-6 text-slate-500 dark:text-analyst-text-secondary" />
                    </button>
                </header>
                <div className="p-4 border-b border-slate-200 dark:border-analyst-border flex-shrink-0">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search Countries..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-md py-2.5 pl-10 pr-4 text-slate-900 dark:text-analyst-text-primary placeholder:text-analyst-text-secondary focus:outline-none focus:ring-2 focus:ring-analyst-accent focus:border-transparent"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-analyst-text-secondary pointer-events-none" />
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {filteredCountries.length > 0 ? (
                        <ul className="divide-y divide-slate-200 dark:divide-analyst-border">
                            {filteredCountries.map(country => (
                                <li key={country.name}>
                                    <button onClick={() => onSelectCountry(country.name)} className="w-full text-left flex items-center gap-4 px-4 py-3 hover:bg-analyst-accent/10 transition-colors group">
                                        {country.flag.startsWith('http') ? (
                                            <img src={country.flag} alt={`Flag of ${country.displayName}`} className="w-7 h-auto rounded-sm object-contain flex-shrink-0" />
                                        ) : (
                                            <span className="text-2xl w-7 text-center flex-shrink-0">{country.flag}</span>
                                        )}
                                        <span className="text-slate-800 dark:text-analyst-text-primary group-hover:text-analyst-accent">{country.displayName}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="text-center p-8 flex flex-col items-center">
                            <SearchIcon className="w-12 h-12 text-analyst-input mb-4" />
                            <h3 className="text-lg font-semibold text-analyst-text-primary">No Countries Found</h3>
                            <p className="mt-1 text-analyst-text-secondary max-w-xs">Your search did not match any countries. Please try a different term.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountrySelectorModal;