import React from 'react';
import { ExternalArticle } from '../../types';
import { NewspaperIcon } from '../Icons';
import { formatDate } from '../../utils/time';
import BasePanel from '../common/BasePanel';

interface NationalPressPanelProps {
  articles: ExternalArticle[];
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const NationalPressArticleItem: React.FC<{ article: ExternalArticle }> = ({ article }) => {
    return (
        <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block p-4 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-200/70 dark:hover:border-slate-700/50"
        >
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{article.summary}</p>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                        {article.source}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(article.publishedDate)}
                    </span>
                </div>
            </div>
        </a>
    );
};

const NewNationalPressPanel: React.FC<NationalPressPanelProps> = ({ 
    articles, 
    countryName, 
    loading = false, 
    error = null, 
    onRefresh 
}) => {
    const hasData = articles && articles.length > 0;
    const errorMessage = !hasData && !loading ? error || 'No national press data available' : null;

    return (
        <BasePanel
            title="National Press"
            subtitle={`Recent articles from ${countryName}'s national press sources.`}
            icon={<NewspaperIcon className="h-5 w-5 text-amber-600 dark:text-amber-500" />}
            loading={loading}
            error={error || errorMessage}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
            className="h-full flex flex-col"
        >
            {hasData ? (
                <div className="space-y-3 overflow-y-auto flex-1">
                    {articles.map((article, index) => (
                        <NationalPressArticleItem key={`${article.url}-${index}`} article={article} />
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
};

export default NewNationalPressPanel;