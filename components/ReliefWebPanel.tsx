import React from 'react';
import { LifebuoyIcon, ExternalLinkIcon } from './Icons';
import { ReliefWebUpdate } from '../types';

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


const ReliefWebPanel: React.FC<{ updates: ReliefWebUpdate[], countryName: string }> = ({ updates, countryName }) => {
    const errorMessage = updates.length > 0 ? updates[0].message : null;

    if (errorMessage) {
        return (
             <div className="text-center p-16">
                <LifebuoyIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">No Humanitarian Data</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{`Could not retrieve humanitarian updates for ${countryName}.`}</p>
                <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {errorMessage}</p>
            </div>
        );
    }
    
    if (updates.length === 0) {
        return (
            <div className="text-center p-16">
                <LifebuoyIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">No Humanitarian Data</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{`No recent humanitarian updates found for ${countryName} on ReliefWeb.`}</p>
            </div>
        );
    }
    
    return (
        <div>
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Humanitarian Updates</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{`Latest updates from ReliefWeb for ${countryName}.`}</p>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {updates.map((item) => (
                    <UpdateItem key={item.link} item={item} />
                ))}
            </div>
        </div>
    );
}

export default ReliefWebPanel;