import React from 'react';
import { LifebuoyIcon, ExternalLinkIcon } from './Icons';
import { ReliefWebUpdate } from '../types';
import BasePanel from './common/BasePanel';

const UpdateItem: React.FC<{ item: ReliefWebUpdate }> = ({ item }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40 group">
             <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-500">{item.title}</h3>
             <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">{item.description}</p>
             <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <span>{formatDate(item.publishedDate)}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-500">
                    View Source
                    <ExternalLinkIcon className="h-3 w-3" />
                </div>
            </div>
        </a>
    );
};


interface ReliefWebPanelProps {
  updates: ReliefWebUpdate[];
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const ReliefWebPanel: React.FC<ReliefWebPanelProps> = ({ updates, countryName, loading, error, onRefresh }) => {
    const hasData = updates && updates.length > 0 && !updates[0].message;
    const errorMessage = !hasData && !loading ? updates?.[0]?.message || 'No recent humanitarian updates found on ReliefWeb.' : null;

    return (
        <BasePanel
            title="Humanitarian Updates"
            subtitle={`Latest updates from ReliefWeb for ${countryName}.`}
            icon={<LifebuoyIcon className="h-5 w-5 text-red-600 dark:text-red-500" />}
            loading={loading}
            error={error || errorMessage}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {hasData ? (
                <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                    {updates.map((item) => (
                        <UpdateItem key={item.link} item={item} />
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
}

export default ReliefWebPanel;