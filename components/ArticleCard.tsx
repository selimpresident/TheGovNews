import React, { memo, useCallback } from 'react';
import { Article } from '../types';
import { BookmarkFilledIcon, BookmarkIcon } from './Icons';
import TopicTag from './TopicTag';

interface ArticleCardProps {
  article: Article;
  onSelect: () => void;
  onToggleBookmark: (articleId: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = memo(({ article, onSelect, onToggleBookmark }) => {

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit'});
    }, []);

    const formatSourceName = useCallback((key: string): string => {
      if (!key.includes('.')) return key;
      const parts = key.split('.');
      return parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }, []);

    const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleBookmark(article.article_id);
    }, [onToggleBookmark, article.article_id]);

  return (
    <article
      onClick={onSelect}
      className="p-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 cursor-pointer transition-all duration-200 group relative"
    >
        <button
          onClick={handleBookmarkClick}
          className="absolute top-2 right-2 p-1 rounded text-slate-400 dark:text-slate-500 hover:bg-slate-200/80 dark:hover:bg-slate-600/50 focus:outline-none z-10"
          aria-label="Bookmark article"
      >
          {article.bookmarked ? (
              <BookmarkFilledIcon className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          ) : (
              <BookmarkIcon className="h-4 w-4 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
          )}
      </button>

      <div className="pr-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {formatDate(article.published_at)} &bull; {formatSourceName(article.source_name)}
        </p>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-500 line-clamp-2">
            {article.title}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
          {article.summary_short}
        </p>
         {article.topics && article.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
                {article.topics.slice(0, 3).map((topic) => (
                    <TopicTag key={topic} topic={topic} />
                ))}
                {article.topics.length > 3 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">+{article.topics.length - 3}</span>
                )}
            </div>
        )}
      </div>
    </article>
  );
});

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;