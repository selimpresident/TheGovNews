import React from 'react';
import { WorldBankIndicator } from '../../types';
import { ChartBarIcon, UsersIcon } from '../Icons';
import { indicatorConfig } from '../../services/worldBankService';

const indicatorNames: Record<string, string> = {
    'NY.GDP.MKTP.CD': 'Total GDP (USD)',
    'NY.GDP.PCAP.CD': 'GDP per Capita (USD)',
    'SP.POP.TOTL': 'Total Population',
    'FP.CPI.TOTL.ZG': 'Inflation (Annual %)',
    'SL.UEM.TOTL.ZS': 'Unemployment Rate (%)',
};


const WorldBankPanel: React.FC<{ data: WorldBankIndicator[], countryName: string }> = ({ data, countryName }) => {
    const indicatorIcons: Record<string, React.ReactNode> = {
        'NY.GDP.MKTP.CD': <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
        'NY.GDP.PCAP.CD': <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
        'SP.POP.TOTL': <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-500" />,
        'FP.CPI.TOTL.ZG': <ChartBarIcon className="h-6 w-6 text-orange-600 dark:text-orange-500" />,
        'SL.UEM.TOTL.ZS': <ChartBarIcon className="h-6 w-6 text-red-600 dark:text-red-500" />,
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
    const errorMessage = !hasData ? data?.find(d => d.message)?.message : null;

    if (!hasData) {
        return (
            <div className="text-center p-16">
                <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">No Economic Data Available</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{`Could not retrieve World Bank economic data for ${countryName}.`}</p>
                {errorMessage && <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {errorMessage}</p>}
            </div>
        );
    }
    
    return (
        <div>
            <div className="p-6 md:p-8 border-b border-slate-200/70 dark:border-slate-700/50">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Economic Indicators</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{`Key economic indicators from the World Bank for ${countryName}.`}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-8">
                {data.map(indicator => (
                    <div key={indicator.indicatorCode} className="bg-slate-50/30 dark:bg-slate-900/20 border border-slate-200/70 dark:border-slate-700/50 rounded-lg p-5 flex items-start gap-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                           {indicatorIcons[indicator.indicatorCode] || <ChartBarIcon className="h-6 w-6 text-slate-500" />}
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{indicatorNames[indicator.indicatorCode] || indicator.indicator}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatIndicatorValue(indicator)}</p>
                            {indicator.year && <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Last updated: {indicator.year}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorldBankPanel;