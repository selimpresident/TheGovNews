import React from 'react';
import { GdeltArticle } from '../../types';
import { DocumentTextIcon, XCircleIcon } from '../Icons';
import { formatDate } from '../../utils/time';

const GdeltArticleItem: React.FC<{ article: GdeltArticle }> = ({ article }) => {
    const formatDateString = (dateString: string) => {
        if (!dateString || dateString.length !== 14) return '';
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const date = new Date(`${year}-${month}-${day}`);
        return formatDate(date.toISOString(), undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block p-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{article.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{article.domain}</p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap pl-4">{formatDateString(article.seendate)}</p>
            </div>
        </a>
    );
};

const GdeltInfoPanel: React.FC<{ articles: GdeltArticle[], countryName: string, error?: string | null }> = ({ articles, countryName, error }) => {
    if (error) {
        return (
            <div className="flex-grow flex items-center justify-center p-16 text-center">
                <div>
                    <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">Error Loading Media Data</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{`Could not retrieve global media data for ${countryName}.`}</p>
                    <p className="mt-4 text-xs text-red-500 dark:text-red-400/80 bg-red-500/10 px-2 py-1 rounded-md inline-block">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="flex-grow flex items-center justify-center p-16 text-center">
                <div>
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"/>
                    <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">No Global Media Data</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{`No recent articles mentioning ${countryName} were found in the GDELT database.`}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="divide-y divide-slate-200/70 dark:divide-slate-700/50 overflow-y-auto">
            {articles.map((article, index) => (
                <GdeltArticleItem key={`${article.url}-${index}`} article={article} />
            ))}
        </div>
    );
};

export default GdeltInfoPanel;