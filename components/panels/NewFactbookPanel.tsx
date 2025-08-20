import React from 'react';
import { FactbookData } from '../../types';
import { BookOpenIcon } from '../Icons';
import BasePanel from '../common/BasePanel';

interface FactbookPanelProps {
  data: FactbookData;
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const NewFactbookPanel: React.FC<FactbookPanelProps> = ({ 
  data, 
  countryName, 
  loading = false, 
  error = null, 
  onRefresh 
}) => {
    const hasData = !data.error && data.profile && Object.keys(data.profile).length > 0;
    const errorMessage = !hasData && !loading ? data.error || 'No factbook data available' : null;

    return (
        <BasePanel
            title="Country Profile"
            subtitle={`Data provided by the U.S. Central Intelligence Agency for ${data.country_name || countryName}.`}
            icon={<BookOpenIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />}
            loading={loading}
            error={error || errorMessage}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {hasData && (
                <div className="space-y-8">
                    {Object.entries(data.profile).map(([sectionTitle, details]) => (
                        <div key={sectionTitle} className="bg-white/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/70 dark:border-slate-700/50 overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/50">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{sectionTitle}</h3>
                            </div>
                            <div className="p-4 divide-y divide-slate-200/70 dark:divide-slate-700/50">
                                {Object.entries(details).map(([key, value]) => (
                                    <div key={key} className="py-3 first:pt-0 last:pb-0">
                                        <p className="font-medium text-sm text-slate-600 dark:text-slate-300 mb-1">{key}</p>
                                        <p className="text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap">{value}</p>
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

export default NewFactbookPanel;