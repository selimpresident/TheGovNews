import React from 'react';
import { CloudIcon } from './Icons';
import { NoaaIndicator } from '../types';

interface NoaaPanelProps {
  data: NoaaIndicator[];
  countryName: string;
}

const NoaaPanel: React.FC<NoaaPanelProps> = ({ data, countryName }) => {
    const indicatorDisplayNames: Record<string, string> = {
      TAVG: "Average Temperature",
      PRCP: "Precipitation"
    };

    const formatIndicatorValue = (indicator: NoaaIndicator) => {
        if (indicator.value === null || indicator.value === undefined) return 'N/A';
        const valueStr = indicator.value.toLocaleString(undefined, { maximumFractionDigits: 1 });
        return `${valueStr}${indicator.unit || ''}`;
    };
    
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const hasData = data && data.some(d => d.value !== null);
    const errorMessage = !hasData ? data?.[0]?.message : null;

    if (!hasData) {
        return (
            <div className="text-center p-16">
                <CloudIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-analyst-text-secondary"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">No Climate Data</h3>
                <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary max-w-md mx-auto">{`Could not retrieve recent climate data from NOAA for ${countryName}. This may be due to API limitations or lack of reporting stations.`}</p>
                {errorMessage && <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {errorMessage}</p>}
            </div>
        );
    }
    
    return (
        <div>
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-analyst-border">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-analyst-text-primary">Climate & Environment</h2>
                <p className="text-slate-500 dark:text-analyst-text-secondary mt-1">{`Recent climate data from NOAA's Global Historical Climatology Network for ${countryName}.`}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                {data.map(indicator => (
                    <div key={indicator.name} className="bg-slate-50/50 dark:bg-analyst-input/50 border border-slate-200 dark:border-analyst-border rounded-lg p-5">
                        <p className="text-sm text-slate-600 dark:text-analyst-text-secondary font-medium mb-1">{indicatorDisplayNames[indicator.name] || indicator.name}</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-analyst-text-primary">{formatIndicatorValue(indicator)}</p>
                        {indicator.date && <p className="text-xs text-slate-500 dark:text-analyst-text-secondary mt-2">Data for {formatDate(indicator.date)}</p>}
                         {indicator.message && !indicator.value && <p className="text-xs text-slate-500 dark:text-analyst-text-secondary mt-2">{indicator.message}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoaaPanel;