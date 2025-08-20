import React from 'react';
import { FactbookData } from '../../types';
import { BookOpenIcon } from '../Icons';
import { BasePanel } from '../common/BasePanel';

interface FactbookPanelProps {
    data: FactbookData;
    countryName: string;
    loading?: boolean;
    error?: string;
    onRefresh?: () => void;
}

const FactbookPanel: React.FC<FactbookPanelProps> = ({ 
    data, 
    countryName, 
    loading = false,
    error = data.error || (!data.profile || Object.keys(data.profile).length === 0) ? `Could not retrieve the CIA World Factbook profile for ${countryName}.` : undefined,
    onRefresh 
}) => {
    const hasData = data.profile && Object.keys(data.profile).length > 0;
    
    return (
        <BasePanel
            title="Country Profile (CIA World Factbook)"
            subtitle={`Data provided by the U.S. Central Intelligence Agency for ${data.country_name || countryName}.`}
            icon={<BookOpenIcon className="h-6 w-6" />}
            loading={loading}
            error={error}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {hasData && (
                <div className="space-y-8">
                    {Object.entries(data.profile).map(([sectionTitle, details]) => (
                        <div key={sectionTitle} className="group">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-slate-200/70 dark:border-slate-700/50 pb-2 mb-4 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{sectionTitle}</h3>
                            <div className="space-y-4">
                                {Object.entries(details).map(([key, value]) => (
                                    <div key={key} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-800/30 p-3 rounded-lg transition-colors">
                                        <p className="font-semibold text-slate-600 dark:text-slate-300">{key}</p>
                                        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap mt-1">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </BasePanel>
    );
};

export default FactbookPanel;