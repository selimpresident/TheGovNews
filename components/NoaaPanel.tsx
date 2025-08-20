import React from 'react';
import { CloudIcon } from './Icons';
import { NoaaIndicator } from '../types';
import BasePanel from './common/BasePanel';

interface NoaaPanelProps {
  data: NoaaIndicator[];
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const NoaaPanel: React.FC<NoaaPanelProps> = ({ data, countryName, loading, error, onRefresh }) => {
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
    const errorMessage = !hasData && !loading ? data?.[0]?.message || 'Could not retrieve recent climate data from NOAA. This may be due to API limitations or lack of reporting stations.' : null;

    return (
        <BasePanel
            title="Climate & Environment"
            subtitle={`Recent climate data from NOAA's Global Historical Climatology Network for ${countryName}.`}
            icon={<CloudIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
            loading={loading}
            error={error || errorMessage}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {hasData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map(indicator => (
                        <div key={indicator.name} className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-700/50 rounded-lg p-4 transition-all hover:shadow-md">
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{indicatorDisplayNames[indicator.name] || indicator.name}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatIndicatorValue(indicator)}</p>
                            {indicator.date && <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Data for {formatDate(indicator.date)}</p>}
                            {indicator.message && !indicator.value && <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{indicator.message}</p>}
                        </div>
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
};

export default NoaaPanel;