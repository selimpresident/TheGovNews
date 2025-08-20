import React from 'react';
import { CloudIcon } from '../Icons';
import { NoaaIndicator } from '../../types';
import BasePanel from '../common/BasePanel';

interface NoaaPanelProps {
  data: NoaaIndicator[];
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const NewNoaaPanel: React.FC<NoaaPanelProps> = ({ 
  data, 
  countryName, 
  loading = false, 
  error = null, 
  onRefresh 
}) => {
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
    const errorMessage = !hasData && !loading ? data?.[0]?.message || 'No climate data available' : null;

    return (
        <BasePanel
            title="Climate & Environment"
            subtitle={`Recent climate data from NOAA's Global Historical Climatology Network for ${countryName}.`}
            icon={<CloudIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
            loading={loading}
            error={error || errorMessage}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {hasData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map(indicator => (
                        <div 
                            key={indicator.name} 
                            className="bg-gradient-to-br from-slate-50/70 to-slate-50/30 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200/70 dark:border-slate-700/50 rounded-lg p-4 transition-all hover:shadow-md"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {indicatorDisplayNames[indicator.name] || indicator.name}
                                </p>
                                {indicator.date && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                                        {formatDate(indicator.date)}
                                    </p>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {formatIndicatorValue(indicator)}
                            </p>
                            {indicator.message && !indicator.value && (
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                    {indicator.message}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
};

export default NewNoaaPanel;