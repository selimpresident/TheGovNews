import React from 'react';
import { ConflictPoint } from '../../types';
import { DocumentTextIcon, FireIcon, XCircleIcon } from '../Icons';
import { formatDate } from '../../utils/time';

interface ConflictInfoPanelProps {
  events: ConflictPoint[],
  countryName: string;
  error?: string | null;
}

const ConflictInfoPanel: React.FC<{ events: ConflictPoint[], countryName: string, error?: string | null }> = ({ events, countryName, error }) => {
    if (error) {
        return (
            <div className="text-center p-16">
                <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">Error Loading Conflict Data</h3>
                <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary max-w-md mx-auto">{`Could not retrieve conflict data for ${countryName}. The service might be temporarily unavailable.`}</p>
                <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {error}</p>
            </div>
        );
    }
    
    if (events.length === 0) {
        return (
            <div className="text-center p-16">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-analyst-text-secondary"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">No Conflict Data</h3>
                <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary">{`No recent conflict data is available for ${countryName}.`}</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-analyst-text-primary mb-2">Security Briefing</h2>
            <p className="text-slate-500 dark:text-analyst-text-secondary mb-6">{`Recent conflict events in ${countryName} according to UCDP data.`}</p>
            <div className="space-y-6">
                {events.map(event => (
                    <div key={event.id} className="p-4 border border-slate-200 dark:border-analyst-border rounded-lg bg-slate-50/50 dark:bg-analyst-input/50">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                                <h3 className="font-bold text-slate-800 dark:text-analyst-text-primary">{event.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-analyst-text-secondary">{formatDate(event.date, undefined, { year: 'numeric', month: 'long', day: 'numeric' })} &bull; {event.country}</p>
                           </div>
                           <div className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-500/10 dark:text-red-400 px-2.5 py-1 rounded-full">
                                <FireIcon className="h-4 w-4" />
                                <span>{event.fatalities.toLocaleString()} fatalities</span>
                           </div>
                        </div>

                         <p className="text-sm text-slate-600 dark:text-analyst-text-secondary my-3">{event.description}</p>

                        <div className="text-xs border-t border-slate-200 dark:border-analyst-border pt-3">
                           <p className="font-semibold text-slate-600 dark:text-analyst-text-secondary mb-1">Parties Involved:</p>
                           <div className="flex gap-4">
                            <p className="text-slate-500 dark:text-analyst-text-secondary"><span className="font-medium text-slate-700 dark:text-analyst-text-primary">Side A:</span> {event.side_a}</p>
                            <p className="text-slate-500 dark:text-analyst-text-secondary"><span className="font-medium text-slate-700 dark:text-analyst-text-primary">Side B:</span> {event.side_b}</p>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConflictInfoPanel;