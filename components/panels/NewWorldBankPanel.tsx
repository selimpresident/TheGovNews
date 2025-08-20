import React from 'react';
import { WorldBankIndicator } from '../../types';
import { ChartBarIcon, UsersIcon } from '../Icons';
import { indicatorConfig } from '../../services/worldBankService';
import BasePanel from '../common/BasePanel';

const indicatorNames: Record<string, string> = {
    'NY.GDP.MKTP.CD': 'Total GDP (USD)',
    'NY.GDP.PCAP.CD': 'GDP per Capita (USD)',
    'SP.POP.TOTL': 'Total Population',
    'FP.CPI.TOTL.ZG': 'Inflation (Annual %)',
    'SL.UEM.TOTL.ZS': 'Unemployment Rate (%)',
};

interface WorldBankPanelProps {
    data: WorldBankIndicator[];
    countryName: string;
    loading?: boolean;
    error?: string | null;
    onRefresh?: () => void;
}

const NewWorldBankPanel: React.FC<WorldBankPanelProps> = ({ 
    data, 
    countryName, 
    loading = false, 
    error = null, 
    onRefresh 
}) => {
    const indicatorIcons: Record<string, React.ReactNode> = {
        'NY.GDP.MKTP.CD': <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
        'NY.GDP.PCAP.CD': <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
        'SP.POP.TOTL': <UsersIcon className="h-5 w-5 text-green-600 dark:text-green-500" />,
        'FP.CPI.TOTL.ZG': <ChartBarIcon className="h-5 w-5 text-orange-600 dark:text-orange-500" />,
        'SL.UEM.TOTL.ZS': <ChartBarIcon className="h-5 w-5 text-red-600 dark:text-red-500" />,
    };

    const formatIndicatorValue = (indicator: WorldBankIndicator) => {
        if (indicator.value === null || indicator.value === undefined) return 'N/A';
        
        const config = Object.values(indicatorConfig).find((c: { code: string; format: 'currency' | 'number' | 'percent' }) => c.code === indicator.indicatorCode);
        const formatType = config ? config.format : 'number';

        switch (formatType) {
            case 'currency':
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(indicator.value);
            case 'percent':
                return `${indicator.value.toFixed(2)}%`;
            case 'number':
                return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(indicator.value);
            default:
                return indicator.value.toLocaleString();
        }
    };

    const hasData = data && data.some(d => d.value !== null);
    const errorMessage = !hasData && !loading ? data?.find(d => d.message)?.message || 'No data available' : null;

    return (
        <BasePanel
            title="Economic Indicators"
            subtitle={`Key economic indicators from the World Bank for ${countryName}.`}
            icon={<ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
            loading={loading}
            error={error || errorMessage}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {hasData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map(indicator => (
                        <div 
                            key={indicator.indicatorCode} 
                            className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-700/50 rounded-lg p-4 flex items-start gap-3 transition-all hover:shadow-md"
                        >
                            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full">
                                {indicatorIcons[indicator.indicatorCode] || <ChartBarIcon className="h-5 w-5 text-slate-500" />}
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">
                                    {indicatorNames[indicator.indicatorCode] || indicator.indicator}
                                </p>
                                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {formatIndicatorValue(indicator)}
                                </p>
                                {indicator.year && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
                                        Last updated: {indicator.year}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
};

export default NewWorldBankPanel;