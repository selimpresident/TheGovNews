import React from 'react';
import { GdeltArticle } from '../../types';
import { DocumentTextIcon } from '../Icons';
import { formatDate } from '../../utils/time';
import BasePanel from '../common/BasePanel';

interface GdeltInfoPanelProps {
  articles: GdeltArticle[];
  countryName: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

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
        <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block p-4 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-200/70 dark:hover:border-slate-700/50"
        >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        {article.domain}
                    </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap pl-3 bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded-full">
                    {formatDateString(article.seendate)}
                </p>
            </div>
        </a>
    );
};

const NewGdeltInfoPanel: React.FC<GdeltInfoPanelProps> = ({ 
    articles, 
    countryName, 
    loading = false, 
    error = null, 
    onRefresh 
}) => {
    const hasData = articles && articles.length > 0;
    const errorMessage = !hasData && !loading ? error || 'No global media data available' : null;

    return (
        <BasePanel
            title="Global Media Coverage"
            subtitle={`Recent articles mentioning ${countryName} from the GDELT database.`}
            icon={<DocumentTextIcon className="h-5 w-5 text-green-600 dark:text-green-500" />}
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
                        <GdeltArticleItem key={`${article.url}-${index}`} article={article} />
                    ))}
                </div>
            ) : null}
        </BasePanel>
    );
};

export default NewGdeltInfoPanel;