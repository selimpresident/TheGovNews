import React from 'react';
import { ChartBarIcon } from './Icons';
import { OecdIndicator } from '../types';
import BasePanel from './common/BasePanel';

interface OecdPanelProps {
  data: OecdIndicator[];
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const OecdPanel: React.FC<OecdPanelProps> = ({ data, countryName, loading, error, onRefresh }) => {
    const formatIndicatorValue = (indicator: OecdIndicator) => {
        if (indicator.value === null || indicator.value === undefined) return 'N/A';
        return `${indicator.value.toFixed(2)}%`; // Most OECD indicators here are percentages
    };

    const hasData = data && data.some(d => d.value !== null);
    const errorMessage = !hasData && !loading ? data?.[0]?.message || 'OECD data may not be available for this country, as it is typically limited to member countries.' : null;

    return (
        <BasePanel
            title="OECD Economic Outlook"
            subtitle={`Key economic indicators from the OECD for ${countryName}.`}
            icon={<ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
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
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{indicator.name}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatIndicatorValue(indicator)}</p>
                            {indicator.year && <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Last updated: {indicator.year}</p>}
                        </div>
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
};

export default OecdPanel;