import React from 'react';
import { ConflictPoint } from '../../types';
import { FireIcon } from '../Icons';
import { formatDate } from '../../utils/time';
import BasePanel from '../common/BasePanel';

interface ConflictInfoPanelProps {
  events: ConflictPoint[];
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const NewConflictInfoPanel: React.FC<ConflictInfoPanelProps> = ({ 
  events, 
  countryName, 
  loading = false, 
  error = null, 
  onRefresh 
}) => {
    const hasData = events && events.length > 0;
    const errorMessage = !hasData && !loading ? error || 'No conflict data available' : null;

    return (
        <BasePanel
            title="Security Briefing"
            subtitle={`Recent conflict events in ${countryName} according to UCDP data.`}
            icon={<FireIcon className="h-5 w-5 text-red-600 dark:text-red-500" />}
            loading={loading}
            error={error || errorMessage}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {hasData ? (
                <div className="space-y-4">
                    {events.map(event => (
                        <div 
                            key={event.id} 
                            className="p-4 border border-slate-200/70 dark:border-slate-700/50 rounded-lg bg-gradient-to-r from-slate-50/70 to-slate-50/30 dark:from-slate-800/30 dark:to-slate-800/10 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{event.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {formatDate(event.date, undefined, { year: 'numeric', month: 'long', day: 'numeric' })} &bull; {event.country}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-500/10 dark:text-red-400 px-2.5 py-1 rounded-full">
                                    <FireIcon className="h-3.5 w-3.5" />
                                    <span>{event.fatalities.toLocaleString()} fatalities</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-300 my-3 line-clamp-3">{event.description}</p>

                            <div className="text-xs border-t border-slate-200/70 dark:border-slate-700/50 pt-3 mt-3">
                                <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Parties Involved:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="bg-slate-100/80 dark:bg-slate-700/30 px-3 py-2 rounded">
                                        <p className="text-slate-500 dark:text-slate-400">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">Side A:</span> {event.side_a}
                                        </p>
                                    </div>
                                    <div className="bg-slate-100/80 dark:bg-slate-700/30 px-3 py-2 rounded">
                                        <p className="text-slate-500 dark:text-slate-400">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">Side B:</span> {event.side_b}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
};

export default NewConflictInfoPanel;