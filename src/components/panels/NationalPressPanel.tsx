import React from 'react';
import { ExternalArticle } from '../../types';
import { NewspaperIcon } from '../Icons';
import { formatDate } from '../../utils/time';

const NationalPressArticleItem: React.FC<{ article: ExternalArticle }> = ({ article }) => {
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block p-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-analyst-item-hover">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-analyst-text-primary mb-1">{article.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-analyst-text-secondary mb-2">{article.summary}</p>
                    <p className="text-xs text-slate-500 dark:text-analyst-text-secondary">{article.source} &bull; {formatDate(article.publishedDate)}</p>
                </div>
            </div>
        </a>
    );
};

const NationalPressPanel: React.FC<{ articles: ExternalArticle[], countryName: string }> = ({ articles, countryName }) => {
    if (articles.length === 0) {
        return (
            <div className="text-center p-16">
                <NewspaperIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-analyst-text-secondary"/>
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">No National Press Data</h3>
                <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary">{`Could not retrieve national press articles for ${countryName} at this time.`}</p>
            </div>
        );
    }
    
    return (
        <div className="divide-y divide-slate-200/70 dark:divide-analyst-border/50">
            {articles.map((article, index) => (
                <NationalPressArticleItem key={`${article.url}-${index}`} article={article} />
            ))}
        </div>
    );
};

export default NationalPressPanel;