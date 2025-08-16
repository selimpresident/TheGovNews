import React from 'react';
import { Article } from '../types';

interface TimelineProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

const TimelineEvent: React.FC<{ article: Article, onSelect: () => void }> = ({ article, onSelect }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="relative flex-shrink-0 w-64 snap-start text-center group">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-slate-300 dark:bg-analyst-border"></div>
            <div className="relative z-10 w-4 h-4 rounded-full bg-slate-400 dark:bg-analyst-text-secondary border-4 border-white dark:border-analyst-sidebar/80 mx-auto transition-colors group-hover:bg-analyst-accent"></div>
            <p className="text-xs font-semibold text-slate-500 dark:text-analyst-text-secondary mt-2">{formatDate(article.published_at)}</p>
            <div 
                className="mt-2 p-3 bg-white dark:bg-analyst-input/50 border border-slate-200 dark:border-analyst-border rounded-lg shadow-sm cursor-pointer hover:border-analyst-accent dark:hover:border-analyst-accent hover:shadow-md transition-all"
                onClick={onSelect}
            >
                <p className="text-sm font-medium text-slate-800 dark:text-analyst-text-primary line-clamp-3">{article.title}</p>
            </div>
        </div>
    );
};


const Timeline: React.FC<TimelineProps> = ({ articles, onArticleSelect }) => {
    if (articles.length < 3) { // Only show timeline for 3 or more articles
        return null; 
    }

    const sortedArticles = [...articles].sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());

    return (
        <div className="p-6 bg-slate-50/20 dark:bg-analyst-sidebar/30 rounded-lg mb-8 backdrop-blur-sm border border-slate-200/30 dark:border-analyst-border/30">
            <h3 className="text-lg font-bold text-slate-900 dark:text-analyst-text-primary mb-4">Events Timeline</h3>
            <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory py-4 -mx-6 px-6">
                {sortedArticles.map(article => (
                    <TimelineEvent key={article.article_id} article={article} onSelect={() => onArticleSelect(article)} />
                ))}
                 <div className="flex-shrink-0 w-8"></div> {/* Spacer */}
            </div>
        </div>
    );
};

export default Timeline;