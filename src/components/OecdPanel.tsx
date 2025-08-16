import React from 'react';
import { ChartBarIcon } from './Icons';
import { OecdIndicator } from '../types';

interface OecdPanelProps {
  data: OecdIndicator[];
  countryName: string;
}

const OecdPanel: React.FC<OecdPanelProps> = ({ data, countryName }) => {
    const formatIndicatorValue = (indicator: OecdIndicator) => {
        if (indicator.value === null || indicator.value === undefined) return 'N/A';
        return `${indicator.value.toFixed(2)}%`; // Most OECD indicators here are percentages
    };

    const hasData = data && data.some(d => d.value !== null);

    if (!hasData) {
        return (
            <div className="text-center p-16">
                <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-analyst-text-secondary"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">No OECD Data Available</h3>
                <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary max-w-md mx-auto">{`OECD data may not be available for ${countryName}, as it is typically limited to member countries.`}</p>
                {data?.[0]?.message && <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {data[0].message}</p>}
            </div>
        );
    }
    
    return (
        <div>
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-analyst-border">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-analyst-text-primary">OECD Economic Outlook</h2>
                <p className="text-slate-500 dark:text-analyst-text-secondary mt-1">{`Key economic indicators from the OECD for ${countryName}.`}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                {data.map(indicator => (
                    <div key={indicator.name} className="bg-slate-50/50 dark:bg-analyst-input/50 border border-slate-200 dark:border-analyst-border rounded-lg p-5">
                        <p className="text-sm text-slate-600 dark:text-analyst-text-secondary font-medium mb-1">{indicator.name}</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-analyst-text-primary">{formatIndicatorValue(indicator)}</p>
                        {indicator.year && <p className="text-xs text-slate-500 dark:text-analyst-text-secondary mt-2">Last updated: {indicator.year}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OecdPanel;