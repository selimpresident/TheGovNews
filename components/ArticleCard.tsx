import React from 'react';
import { Article } from '../types';
import { BookmarkFilledIcon, BookmarkIcon } from './Icons';
import TopicTag from './TopicTag';

interface ArticleCardProps {
  article: Article;
  onSelect: () => void;
  onToggleBookmark: (articleId: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect, onToggleBookmark }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit'});
    }

    const formatSourceName = (key: string): string => {
      if (!key.includes('.')) return key;
      const parts = key.split('.');
      return parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    };

    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleBookmark(article.article_id);
    };

  return (
    <article
      onClick={onSelect}
      className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 cursor-pointer transition-all duration-300 ease-in-out group relative hover:shadow-lg transform hover:-translate-y-1"
    >
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-200/80 dark:hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 z-10"
          aria-label="Bookmark article"
      >
          {article.bookmarked ? (
              <BookmarkFilledIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          ) : (
              <BookmarkIcon className="h-5 w-5 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
          )}
      </button>

      <div className="pr-8">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {formatDate(article.published_at)} &bull; {formatSourceName(article.source_name)}
        </p>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            {article.title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {article.summary_short}
        </p>
         {article.topics && article.topics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
                {article.topics.map((topic) => (
                    <TopicTag key={topic} topic={topic} />
                ))}
            </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;