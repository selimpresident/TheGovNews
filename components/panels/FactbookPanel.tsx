import React from 'react';
import { FactbookData } from '../../types';
import { BookOpenIcon } from '../Icons';

const FactbookPanel: React.FC<{ data: FactbookData, countryName: string }> = ({ data, countryName }) => {
    if (data.error || !data.profile || Object.keys(data.profile).length === 0) {
        return (
            <div className="text-center p-16">
                <BookOpenIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">No Factbook Data Available</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{`Could not retrieve the CIA World Factbook profile for ${countryName}.`}</p>
                {data.error && <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {data.error}</p>}
            </div>
        );
    }
    
    return (
        <div>
            <div className="p-6 md:p-8 border-b border-slate-200/70 dark:border-slate-700/50">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Country Profile (CIA World Factbook)</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{`Data provided by the U.S. Central Intelligence Agency for ${data.country_name || countryName}.`}</p>
            </div>
            <div className="p-6 md:p-8">
                {Object.entries(data.profile).map(([sectionTitle, details]) => (
                    <div key={sectionTitle} className="mb-10">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-slate-200/70 dark:border-slate-700/50 pb-2 mb-4">{sectionTitle}</h3>
                        <div className="space-y-4">
                            {Object.entries(details).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                    <p className="font-semibold text-slate-600 dark:text-slate-300">{key}</p>
                                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap mt-1">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FactbookPanel;