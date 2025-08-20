import React, { memo, useMemo, useCallback } from 'react';
import { Article } from '../types';

interface TimelineProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

const TimelineEvent: React.FC<{ article: Article, onSelect: () => void }> = memo(({ article, onSelect }) => {
    const formattedDate = useMemo(() => {
        return new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }, [article.published_at]);

    return (
        <div className="relative flex-shrink-0 w-48 snap-start text-center group">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-slate-300 dark:bg-slate-600"></div>
            <div className="relative z-10 w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500 border-2 border-white dark:border-slate-800/80 mx-auto transition-colors group-hover:bg-blue-500"></div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{formattedDate}</p>
            <div 
                className="mt-1 p-2 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded shadow-sm cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                onClick={onSelect}
            >
                <p className="text-xs font-medium text-slate-800 dark:text-slate-100 line-clamp-2">{article.title}</p>
            </div>
        </div>
    );
});

TimelineEvent.displayName = 'TimelineEvent';


const Timeline: React.FC<TimelineProps> = memo(({ articles, onArticleSelect }) => {
    const sortedArticles = useMemo(() => {
        return [...articles].sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
    }, [articles]);

    const handleArticleSelect = useCallback((article: Article) => {
        onArticleSelect(article);
    }, [onArticleSelect]);

    if (articles.length < 3) { // Only show timeline for 3 or more articles
        return null; 
    }

    return (
        <div className="p-3 bg-slate-50/20 dark:bg-slate-800/20 backdrop-blur-sm border-b border-slate-200/30 dark:border-slate-700/30">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Timeline</h3>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2">
                {sortedArticles.map(article => (
                    <TimelineEvent key={article.article_id} article={article} onSelect={() => handleArticleSelect(article)} />
                ))}
                 <div className="flex-shrink-0 w-4"></div> {/* Spacer */}
            </div>
        </div>
    );
});

Timeline.displayName = 'Timeline';

export default Timeline;